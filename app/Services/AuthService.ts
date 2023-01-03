import { JWTTokenContract } from '@ioc:Adonis/Addons/Jwt'
import { string } from '@ioc:Adonis/Core/Helpers'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'
import CreateUserValidator from 'App/Validators/Auth/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/Auth/UpdateUserValidator'
import { Exception } from '@adonisjs/core/build/standalone'

export default class AuthService {
  /**
   * Gets user profile
   * @param user user
   * @param jwt jwt tokens
   * @returns user profile
   */
  public getProfile (user: User, jwt: JWTTokenContract<User>) {
    const serialized = user.toJSON()

    serialized.subscriptions = user.subscriptions.map((sub) => {
      return {
        id: sub.id,
        service: string.capitalCase(sub.service),
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
      }
    })

    serialized.access_token = jwt.accessToken
    serialized.refresh_token = jwt.refreshToken

    return serialized
  }
  /**
   * Gets user profile without tokens
   * @param user user
   * @returns user profile
   */
  public getProfileSimple (user: User) {
    const serialized = user.toJSON()

    delete serialized.remember_me_token

    serialized.subscriptions = user.subscriptions.map((sub) => {
      return {
        id: sub.id,
        service: string.capitalCase(sub.service),
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
      }
    })

    return serialized
  }
  /**
   * Prepares paginated users object
   * @param users users
   * @returns
   */
  public preparePaginatedUsers (users: ModelPaginatorContract<User>) {
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
   * Prepares user api tokens for admin
   * @param tokens tokens
   * @returns
   */
  public prepareApiTokens (tokens: ApiToken[]) {
    return tokens.map((val) => {
      return {
        id: val.$original.id,
        name: val.$original.name,
        user_name: val.$extras.userName,
        type: val.$original.type,
        created_at: val.$original.createdAt,
        limit_per_hour: val.$extras.limit_per_hour,
      }
    })
  }
  /**
   * Creates new user
   * @param payload payload
   * @returns
   */
  public async createUser (payload: CreateUserValidator['schema']['props']) {
    const user = await User.create({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      role: payload.role,
    })

    return user.id
  }
  /**
   * Updates user
   * @param user user
   * @param payload payload
   * @param changeRole can change role
   * @returns
   */
  public async updateUser (
    user: User | undefined,
    payload: UpdateUserValidator['schema']['props'],
    changeRole: boolean
  ) {
    if (user) {
      user.name = payload.name

      if (payload.password) {
        user.password = payload.password
      }
      if (changeRole) {
        user.role = payload.role
      }

      await user.save()
      return user.$isPersisted
    } else {
      throw new Exception('Unauthorized', 401)
    }
  }
  /**
   * Deletes user
   * @param user user
   * @returns is deleted
   */
  public async deleteUser (user: User) {
    await user.delete()
    return user.$isDeleted
  }
  /**
   * Revokes user token
   * @param token token
   * @param isAdmin is admin
   * @param user user object
   * @returns is deleted
   */
  public async deleteToken (token: ApiToken, isAdmin: boolean, user?: User) {
    if (!isAdmin && token.user_id !== user?.id) {
      throw new Exception('Forbidden', 403)
    }

    await token.delete()
    return token.$isDeleted
  }
}
