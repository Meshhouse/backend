import Banner from 'App/Models/Banner'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'

export default class BannersRepository {
  /**
   * Gets list of banners
   * @param payload payload
   * @returns banners
   */
  public async list (payload: BasicPaginateValidator['schema']['props']) {
    return Banner
      .query()
      .preload('properties')
      .select('*')
      .paginate(payload.page || 1, payload.count || 50)
  }
  /**
   * Gets banner by id
   * @param id id
   * @returns banner
   */
  public async get (id: number) {
    return Banner
      .query()
      .preload('properties')
      .select('*')
      .where('id', id)
      .firstOrFail()
  }
  /**
   * Gets banner by params
   * @param page banner page type
   * @param categoryId category
   * @returns banenr
   */
  public async getByParams (page: string, categoryId?: number) {
    return Banner
      .query()
      .preload('properties')
      .select('*')
      .where('status', true)
      .whereHas('properties', (query) => {
        query.where('page', page)

        if (categoryId) {
          query.where('category', categoryId)
        }
      })
      .orderBy('created_at', 'desc')
      .firstOrFail()
  }
}
