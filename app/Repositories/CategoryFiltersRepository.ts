import CategoryFilter from 'App/Models/CategoryFilter'

export default class CategoryFiltersRepository {
  /**
   * Get filters for category
   * @param id category id
   * @returns filters
   */
  public async getByCategory (id: string) {
    const knexQuery = CategoryFilter.query().client
    // eslint-disable-next-line @typescript-eslint/quotes, max-len
    const rawSelect = knexQuery.raw('`category_filters`.`id`, `order`, `key`, `type`, `querystring_alias`, `value_delimeter`, `values`, `multiple_values`, `visible`, json_group_array(`category_filters_pivot`.`category_id`) as categories')

    return CategoryFilter
      .query()
      .preload('locales')
      .clearSelect()
      .select(rawSelect)
      .leftJoin('category_filters_pivot', 'category_filters.id', 'category_filters_pivot.filter_id')
      .groupBy('category_filters.id')
      .if(id !== '-1' && id !== 'null', (query) => {
        query.havingRaw(`exists (select 1 from json_each(categories) where value = ${id})`)
      })
  }
  /**
   * Gets single filter by id
   * @param id id
   * @returns filter
   */
  public async getById (id: number) {
    return CategoryFilter.findOrFail(id)
  }
  /**
   * Gets filters for category (alt. implementation)
   * @param id id
   * @returns filters
   */
  public async getByCategorySimple (id: number) {
    return CategoryFilter
      .query()
      .preload('locales')
      // eslint-disable-next-line max-len
      .select('category_filters.id', 'order', 'key', 'type', 'querystring_alias', 'value_delimeter', 'values', 'multiple_values', 'visible')
      .leftJoin('category_filters_pivot', 'category_filters.id', 'category_filters_pivot.filter_id')
      .where('category_filters_pivot.category_id', id)
  }
}
