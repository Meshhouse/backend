import Category from 'App/Models/Category'
import ListCategoryValidator from 'App/Validators/Category/ListCategoryValidator'

export default class CategoriesRepository {
  /**
   * Gets paginated categories
   * @param payload payload
   * @returns categories
   */
  public async getPaginated (payload: ListCategoryValidator['schema']['props']) {
    return Category
      .query()
      .preload('locales')
      .select()
      .where((query) => {
        if (payload.roots_only) {
          query.whereNull('parent_id')
        }
      })
      .paginate(payload.page || 1, (payload.count === -1 ? 10000 : payload.count || 50))
  }
  /**
   * Gets categories
   * @returns categories
   */
  public async get () {
    return Category
      .query()
      .preload('locales')
      .select()
      .orderBy('order', 'asc')
  }
  /**
   * Gets category by id
   * @param id id
   * @returns category
   */
  public async getById (id: number) {
    return Category
      .query()
      .preload('locales')
      .select('*')
      .where({ id })
      .firstOrFail()
  }
  /**
   * Gets category by slug
   * @param slug slug
   * @returns category
   */
  public async getBySlug (slug: string) {
    return Category
      .query()
      .preload('locales')
      .select('*')
      .where('slug', slug)
      .firstOrFail()
  }
  /**
   * Gets categories by ids
   * @param id id
   * @returns categories
   */
  public async getByIds (ids: number[]) {
    return Category
      .query()
      .preload('locales')
      .select('*')
      .whereIn('id', ids)
  }
}
