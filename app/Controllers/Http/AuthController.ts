import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'
import CreateTokenValidator from 'App/Validators/CreateTokenValidator'
import DeleteTokenValidator from 'App/Validators/DeleteTokenValidator'

export default class ModelsController {
  /**
   * Login user
   * @param ctx context
   * @returns login result
   */
  public async login (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
      rememberMe: schema.boolean.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    try {
      const result = await ctx.auth.use('web').attempt(payload.email, payload.password, payload.rememberMe)

      return result
    } catch (error) {
      return ctx.response.unauthorized('Invalid credentials')
    }
  }
  /**
   * Register user
   * @param ctx context
   * @returns success
   */
  public async register (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
      name: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    try {
      await User.findByOrFail('email', payload.email)

      return ctx.response.unprocessableEntity('User already registered')
    } catch (error) {
      await User.create({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: 'basic',
      })

      return ctx.response.ok('Ok')
    }
  }
  /**
   * Get user profile
   * @param ctx context
   * @returns user profile
   */
  public async profile (ctx: HttpContextContract) {
    try {
      const result = await User.findOrFail(ctx.auth.user?.id)

      const user = result.toJSON()

      delete user.remember_me_token
      return user
    } catch (error) {
      return ctx.response.unauthorized('Invalid credentials')
    }
  }
  /**
   * Get user profile
   * @param ctx context
   * @returns user profile
   */
  public async logout (ctx: HttpContextContract) {
    try {
      await ctx.auth.use('web').logout()

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

    const validateSchema = schema.create({
      page: schema.number.optional(),
      count: schema.number.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const users = await User
      .query()
      .select('*')
      .paginate(payload.page || 1, payload.count || 10)

    const serialized = users.serialize()

    return {
      pagination: {
        total: serialized.meta.total,
        current_page: serialized.meta.current_page,
        last_page: serialized.meta.last_page,
      },
      items: serialized.data.map((item) => {
        delete item.remember_me_token

        return item
      }),
    }
  }
  /**
   * Deletes user
   * @param ctx context
   * @returns is user deleted
   */
  public async single (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const validateSchema = schema.create({
      params: schema
        .object()
        .members({
          id: schema.number(),
        }),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    const user = await User.findOrFail(payload.params.id)

    return user
  }
  /**
   * Register user
   * @param ctx context
   * @returns success
   */
  public async create (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
      name: schema.string(),
      role: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    try {
      await User.findByOrFail('email', payload.email)

      return ctx.response.unprocessableEntity('User already registered')
    } catch (error) {
      await User.create({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: payload.role,
      })

      return ctx.response.ok('')
    }
  }
  /**
   * Register user
   * @param ctx context
   * @returns success
   */
  public async update (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      email: schema.string(),
      password: schema.string.optional(),
      name: schema.string(),
      role: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const user = await User.findByOrFail('email', payload.email)
    if (payload.password) {
      user.password = payload.password
    }
    user.name = payload.name
    user.role = payload.role

    await user.save()

    return ctx.response.ok('')
  }
  /**
   * Deletes user
   * @param ctx context
   * @returns is user deleted
   */
  public async deleteUser (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const user = await User.find(payload.id)
    await user?.delete

    return user?.$isDeleted
  }
  /**
   * Get API keys
   * @param ctx context
   * @returns user API keys or all user keys (if admin)
   */
  public async listAPIKeys (ctx: HttpContextContract) {
    try {
      if (await ctx.bouncer.allows('viewAdmin')) {
        const tokensRaw = await ApiToken
          .query()
          .select(
            'api_tokens.id',
            'users.name as userName',
            'api_tokens.name',
            'api_tokens.type',
            'api_tokens.created_at'
          )
          .join('users', 'api_tokens.user_id', 'users.id')

        return tokensRaw.map((val) => {
          return {
            id: val.$original.id,
            name: val.$original.name,
            user_name: val.$extras.userName,
            type: val.$original.type,
            created_at: val.$original.createdAt,
          }
        })
      } else {
        const user = ctx.auth.use('web')?.user

        if (user) {
          const keys = await ApiToken
            .query()
            .select('*')
            .where('user_id', user.id)

          return keys
        } else {
          return ctx.response.unauthorized('Invalid credentials')
        }
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  /**
   * Generates new API token
   * @param ctx context
   * @returns API token result
   */
  public async generateNewKey (ctx: HttpContextContract) {
    try {
      const payload = await ctx.request.validate(CreateTokenValidator)
      const user = await ctx.auth.use('web')?.user

      if (user) {
        const token = await ctx.auth.use('api').generate(user, {
          name: payload.name,
        })

        return token
      } else {
        return ctx.response.unauthorized('Forbidden')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  /**
   * Revokes API token
   * @param ctx context
   * @returns is revoked
   */
  public async revokeKey (ctx: HttpContextContract) {
    try {
      const payload = await ctx.request.validate(DeleteTokenValidator)

      if (await ctx.bouncer.allows('viewAdmin')) {
        const token = await ApiToken.find(payload.id)

        if (token) {
          await token.delete()

          return ctx.response.ok('')
        }
      } else {
        const user = await ctx.auth.use('api')?.user
        if (user) {
          const token = await ApiToken.find(payload.id)

          if (token?.user_id !== user.id) {
            return ctx.response.forbidden('Forbidden')
          } else {
            await token.delete()

            return ctx.response.ok('')
          }
        }
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
