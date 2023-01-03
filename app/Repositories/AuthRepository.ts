import User from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'

export default class AuthRepository {
  /**
   * Gets user by email
   * @param email email
   * @returns user
   */
  public async getByEmail (email: string) {
    return User
      .query()
      .preload('subscriptions')
      .select('*')
      .where('email', email)
      .firstOrFail()
  }
  /**
   * Gets user by id
   * @param id id
   * @returns user
   */
  public async getById (id: number) {
    return User
      .query()
      .preload('subscriptions')
      .select('*')
      .where('id', id)
      .firstOrFail()
  }
  /**
   * Gets paginated users
   * @param payload payload
   * @returns users
   */
  public async getPaginated (payload: { page?: number, count?: number }) {
    return User
      .query()
      .select('*')
      .paginate(payload.page || 1, payload.count || 10)
  }
  /**
   * Gets all user tokens
   * @returns tokens
   */
  public async getTokensForAdmin () {
    return ApiToken
      .query()
      .select(
        'api_tokens.id',
        'users.name as userName',
        'api_tokens.name',
        'api_tokens.type',
        'api_tokens.created_at',
        'api_tokens.limit_per_hour'
      )
      .join('users', 'api_tokens.user_id', 'users.id')
  }
  /**
   * Gets user tokens
   * @param id user id
   * @returns tokens
   */
  public async getTokens (id: number) {
    return ApiToken
      .query()
      .select('*')
      .where('user_id', id)
  }
  /**
   * Gets user token by id
   * @param id token id
   * @returns
   */
  public async getTokenById (id: number) {
    return ApiToken.findOrFail(id)
  }
}
