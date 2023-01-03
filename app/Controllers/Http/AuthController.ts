import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
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
    const payload = await ctx.request.validate(LoginValidator)
    const user = await this.AuthRepository.getByEmail(payload.email)

    if (!(await Hash.verify(user.password, payload.password))) {
      return ctx.response.unauthorized('Invalid credentials')
    }

    const jwt = await ctx.auth.use('jwt').login(user)
    return this.AuthService.getProfile(user, jwt)
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
    const payload = await ctx.request.validate(RegisterValidator)

    try {
      await this.AuthRepository.getByEmail(payload.email)
      return ctx.response.unprocessableEntity('User already registered')
    } catch (error) {
      return await this.AuthService.createUser({
        ...payload,
        role: 'basic',
      })
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
}
