import Blog from 'App/Models/Blog'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'

export default class BlogsRepository {
  /**
   * Gets paginates posts
   * @param payload payload
   * @returns posts
   */
  public async getList (payload: BasicPaginateValidator['schema']['props']) {
    return Blog
      .query()
      .preload('locales')
      .select('id', 'slug', 'thumbnail', 'created_at', 'updated_at')
      .paginate(payload.page || 1, payload.count || 10)
  }
  /**
   * Gets post by id
   * @param id id
   * @returns post
   */
  public async getById (id: number) {
    return Blog.findOrFail(id)
  }
  /**
   * Gets post by slug
   * @param slug slug
   * @returns post
   */
  public async getBySlug (slug: string) {
    return Blog
      .query()
      .preload('locales')
      .select('*')
      .where({ slug })
      .firstOrFail()
  }
}
