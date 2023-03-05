import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import { inject } from '@adonisjs/fold'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import AuthRepository from 'App/Repositories/AuthRepository'
import AuthService from 'App/Services/AuthService'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import CreateUserValidator from 'App/Validators/Auth/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/Auth/UpdateUserValidator'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import RefreshUserValidator from 'App/Validators/Auth/RefreshUserValidator'
import CreateTokenValidator from 'App/Validators/Auth/CreateTokenValidator'
import DeleteTokenValidator from 'App/Validators/Auth/DeleteTokenValidator'
import PathIdValidator from 'App/Validators/Shared/PathIdValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import EmailVerification from 'App/Models/EmailVerification'
import VerifyEmailValidator from 'App/Validators/Auth/VerifyEmailValidator'
import ResetPasswordValidator from 'App/Validators/Auth/ResetPasswordValidator'
import PasswordResetCode from 'App/Models/PasswordResetCode'
import ResetPasswordEmail from 'App/Mailers/ResetPasswordEmail'
import ResetPasswordValidatorConfirm from 'App/Validators/Auth/ResetPasswordValidatorConfirm'
import { generateNumericCode } from 'App/Utils/Number'
import Logger from '@ioc:Adonis/Core/Logger'
import got from 'got'

@inject()
export default class AuthController {
  constructor (
    public AuthRepository: AuthRepository,
    public AuthService: AuthService
  ) {}

  /**
   * Login user
   * @param ctx context
   * @returns login result
   */
  public async login (ctx: HttpContextContract) {
    if (ctx.hcaptcha.success) {
      const payload = await ctx.request.validate(LoginValidator)
      const throttleKey = `login_${payload.email}_${ctx.request.ip()}`

      const limiter = Limiter.use({
        requests: 10,
        duration: '15 mins',
        blockDuration: '30 mins',
      })

      if (await limiter.isBlocked(throttleKey)) {
        return ctx.response.tooManyRequests('Login attempts exhausted. Please try after some time')
      }

      const user = await this.AuthRepository.getByEmail(payload.email)

      if (!(await Hash.verify(user.password, payload.password))) {
        await limiter.increment(throttleKey)
        return ctx.response.unauthorized('Invalid credentials')
      }

      const jwt = await ctx.auth.use('jwt').login(user)

      const userProfile = this.AuthService.getProfile(user, jwt)

      if (userProfile.role !== 'admin' && !userProfile.email_verified_at) {
        return ctx.response.forbidden('Email not verified')
      }

      await limiter.delete(throttleKey)
      return userProfile
    } else {
      return ctx.response.forbidden('')
    }
  }
  /**
   * Refresh user session via token
   * @param ctx context
   * @returns new tokens
   */
  public async refresh (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(RefreshUserValidator)

    const jwt = await ctx.auth.use('jwt').loginViaRefreshToken(payload.refresh_token)
    return {
      access_token: jwt.accessToken,
      refresh_token: jwt.refreshToken,
    }
  }
  /**
   * Register user
   * @param ctx context
   * @returns success
   */
  public async register (ctx: HttpContextContract) {
    if (ctx.hcaptcha.success) {
      const payload = await ctx.request.validate(RegisterValidator)

      try {
        await this.AuthRepository.getByEmail(payload.email)
        return ctx.response.unprocessableEntity('User already registered')
      } catch (error) {
        // Check for "bottable" email
        try {
          const verifyResponse = (await got<any>(`https://api.mailcheck.ai/email/${payload.email}`, {
            responseType: 'json',
          })).body

          if (verifyResponse.status === 200 && verifyResponse.disposable === true) {
            return ctx.response.unprocessableEntity('Possibly bot email detected')
          }
        } catch (error) {
          Logger.warn(`Email check for ${payload.email} has been failed`)
        }

        const user = await this.AuthService.createUser({
          ...payload,
          role: 'basic',
        })

        const hash = await Hash.make(`${user.email}${new Date().valueOf()}`)
        await EmailVerification.create({
          id: user.id,
          hash,
          validUntil: DateTime.now().plus({ hours: 24 }),
        })

        await new VerifyEmail(user, hash).send()
        return user.id
      }
    } else {
      return ctx.response.forbidden('')
    }
  }
  /**
   * Get user profile
   * @param ctx context
   * @returns user profile
   */
  public async profile (ctx: HttpContextContract) {
    if (!ctx.auth.user) {
      ctx.response.unauthorized()
    } else {
      const user = await this.AuthRepository.getById(ctx.auth.user.id)
      return this.AuthService.getProfileSimple(user)
    }
  }
  /**
   * Get user profile
   * @param ctx context
   * @returns user profile
   */
  public async logout (ctx: HttpContextContract) {
    try {
      await ctx.auth.use('jwt').revoke()
      return true
    } catch (error) {
      return ctx.response.unauthorized('Invalid credentials')
    }
  }
  /**
   * Get users list
   * @param ctx context
   * @returns users list
   */
  public async list (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const payload = await ctx.request.validate(BasicPaginateValidator)
    const users = await this.AuthRepository.getPaginated(payload)

    return this.AuthService.preparePaginatedUsers(users)
  }
  /**
   * Deletes user
   * @param ctx context
   * @returns is user deleted
   */
  public async single (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const payload = await ctx.request.validate(PathIdValidator)
    const user = await this.AuthRepository.getById(payload.params.id)

    return user
  }
  /**
   * Creates new user
   * @param ctx context
   * @returns success
   */
  public async create (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const payload = await ctx.request.validate(CreateUserValidator)

    try {
      await this.AuthRepository.getByEmail(payload.email)
      return ctx.response.unprocessableEntity('User already registered')
    } catch (error) {
      return await this.AuthService.createUser(payload)
    }
  }
  /**
   * Updates user
   * @param ctx context
   * @returns success
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateUserValidator)

    if (await ctx.bouncer.allows('viewAdmin')) {
      const user = await this.AuthRepository.getByEmail(payload.email)
      return await this.AuthService.updateUser(user, payload, true)
    } else {
      const user = await ctx.auth.use('api')?.user
      return await this.AuthService.updateUser(user, payload, false)
    }
  }
  /**
   * Deletes user
   * @param ctx context
   * @returns is user deleted
   */
  public async deleteUser (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const payload = await ctx.request.validate(BodyIdValidator)
    const user = await this.AuthRepository.getById(payload.id)

    return await this.AuthService.deleteUser(user)
  }
  /**
   * Get API keys
   * @param ctx context
   * @returns user API keys or all user keys (if admin)
   */
  public async listAPIKeys (ctx: HttpContextContract) {
    if (await ctx.bouncer.allows('viewAdmin')) {
      const tokens = await this.AuthRepository.getTokensForAdmin()
      return this.AuthService.prepareApiTokens(tokens)
    } else {
      const user = ctx.auth.use('jwt')?.user

      if (user) {
        return await this.AuthRepository.getTokens(user.id)
      } else {
        return ctx.response.unauthorized('Invalid credentials')
      }
    }
  }
  /**
   * Generates new API token
   * @param ctx context
   * @returns API token result
   */
  public async generateNewKey (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateTokenValidator)
    const user = await ctx.auth.use('jwt')?.user

    if (user) {
      const token = await ctx.auth.use('api').generate(user, {
        name: payload.name,
      })

      return token
    } else {
      return ctx.response.unauthorized('Forbidden')
    }
  }
  /**
   * Revokes API token
   * @param ctx context
   * @returns is revoked
   */
  public async revokeKey (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(DeleteTokenValidator)
    const user = await ctx.auth.use('api')?.user
    const isAdmin = await ctx.bouncer.allows('viewAdmin')

    if (isAdmin || user) {
      const token = await this.AuthRepository.getTokenById(payload.id)
      return await this.AuthService.deleteToken(token, isAdmin, user)
    } else {
      return ctx.response.forbidden('Forbidden')
    }
  }
  /**
   * Verifies user email
   * @param ctx context
   * @returns is verified or error
   */
  public async verifyEmail (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(VerifyEmailValidator)

    const verifyEntry = await EmailVerification
      .findByOrFail('hash', payload.signature)

    if (DateTime.now() > verifyEntry.validUntil) {
      return ctx.response.notFound('Signature has expired')
    }

    const user = await this.AuthRepository.getById(verifyEntry.id)

    if (user.emailVerifiedAt) {
      return ctx.response.created('Already verified')
    }

    user.emailVerifiedAt = DateTime.now()
    await user.save()
    await verifyEntry.delete()

    return ctx.response.ok('')
  }
  /**
   * Initiates reser user password
   * @param ctx context
   * @returns is initiated
   */
  public async startResetPassword (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ResetPasswordValidator)

    const user = await this.AuthRepository.getByEmail(payload.email)
    try {
      const codeEntry = await PasswordResetCode.findOrFail(user.id)

      if (DateTime.now() > codeEntry.validUntil) {
        throw new Error('Email has expired')
      }

      if (codeEntry.hasSended && !payload.force) {
        return ctx.response.badRequest('Verification email has sended')
      } else if (codeEntry.hasSended && payload.force) {
        await new ResetPasswordEmail(user, codeEntry.code).send()
        return ctx.response.created('')
      }
    } catch (error) {
      const code = generateNumericCode(6)
      await PasswordResetCode.create({
        id: user.id,
        code,
        validUntil: DateTime.now().plus({ hours: 2 }),
        hasSended: true,
      })
      await new ResetPasswordEmail(user, code).send()
      return ctx.response.created('')
    }
  }
  /**
   * Handles reset password (second and final steps)
   * @param ctx context
   * @returns is reseted password or error
   */
  public async resetPassword (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ResetPasswordValidatorConfirm)
    const user = await this.AuthRepository.getByEmail(payload.email)
    try {
      const codeEntry = await PasswordResetCode.findOrFail(user.id)
      const hasEqualCodes = codeEntry.code === payload.code

      if (DateTime.now() > codeEntry.validUntil) {
        return ctx.response.unauthorized('Invalid credentials')
      }

      if (!hasEqualCodes) {
        return ctx.response.unauthorized('Invalid credentials')
      } else {
        if (payload.password) {
          return await this.AuthService.resetPassword(user, payload.password, codeEntry)
        } else {
          return ctx.response.ok('')
        }
      }
    } catch (error) {
      return ctx.response.unauthorized('Invalid credentials')
    }
  }
}
