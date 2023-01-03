import License from 'App/Models/License'

export default class LicensesRepository {
  /**
   * Gets licenses
   * @returns licenses
   */
  public async get () {
    return License
      .query()
      .preload('locales')
      .select()
  }
  /**
   * Gets license by id
   * @param id id
   * @returns license
   */
  public async getById (id: number) {
    return License
      .query()
      .preload('locales')
      .select('*')
      .where({ id })
      .firstOrFail()
  }
}
