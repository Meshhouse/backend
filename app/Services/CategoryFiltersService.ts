import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import CategoryFilter from 'App/Models/CategoryFilter'
import CreateCategoryFilterValidator from 'App/Validators/Category/CreateCategoryFilterValidator'
import UpdateCategoryFilterValidator from 'App/Validators/Category/UpdateCategoryFilterValidator'

export default class CategoryFiltersService {
  /**
   * Prepares filters array
   * @param filters filters
   * @param language localization
   * @returns
   */
  public prepareFilters (filters: CategoryFilter[], language: string | null) {
    return filters.map((filter) => {
      const item = filter.toJSON()

      if (!language) {
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru
      } else {
        item.title = item.locales[`title_${language}`]
      }

      delete item.locales
      item.categories = JSON.parse(filter.$extras.categories) || []

      return item
    })
  }
  /**
   * Syncs category filters pivot table
   * @param id filter id
   * @param categories final categories ids
   */
  public async syncFilterPivot (id: number, categories: number[]) {
    // eslint-disable-next-line @typescript-eslint/quotes, max-len
    const query = await Database.rawQuery("select `category_filters`.`id`, group_concat(`category_filters_pivot`.`category_id`, ';') as categories from `category_filters` left join `category_filters_pivot` on `category_filters`.`id` = `category_filters_pivot`.`filter_id` where category_filters_pivot.filter_id = ? GROUP by `category_filters`.`id`", [id])

    const originalCategories: number[] = query[0].categories.split(';').map((v: string) => Number(v))

    const addedCategories = await Category
      .findMany(categories.filter(x => !originalCategories.includes(x)))
    const deletedCategories = await Category
      .findMany(originalCategories.filter(x => !categories.includes(x)))

    for (const category of addedCategories) {
      await category.related('filters').attach([id])
    }

    for (const category of deletedCategories) {
      await category.related('filters').detach([id])
    }
  }
  /**
   * Creates category filter
   * @param payload payload
   * @returns filter id
   */
  public async create (payload: CreateCategoryFilterValidator['schema']['props']) {
    const filter = await CategoryFilter.create({
      order: payload.order,
      key: payload.key,
      type: payload.type,
      querystringAlias: payload.querystring_alias,
      valueDelimeter: payload.value_delimeter || null,
      values: payload.values,
      multipleValues: payload.multiple_values || false,
      visible: payload.visible,
    })

    await filter.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en || '',
      descriptionRu: payload.description_ru || '',
      unitEn: payload.unit_en || '',
      unitRu: payload.unit_ru || '',
    })

    const categories = await Category
      .findMany(payload.categories)

    for (const category of categories) {
      await category.related('filters').attach([filter.id])
    }

    return filter.id
  }
  /**
   * Updates category filter
   * @param filter filter
   * @param payload payload
   * @returns filter id
   */
  public async update (filter: CategoryFilter, payload: UpdateCategoryFilterValidator['schema']['props']) {
    filter.order = payload.order
    filter.key = payload.key
    filter.querystringAlias = payload.querystring_alias
    filter.valueDelimeter = payload.value_delimeter || null
    filter.values = payload.values
    filter.multipleValues = payload.multiple_values || filter.multipleValues
    filter.visible = payload.visible

    await filter.related('locales').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en || '',
      descriptionRu: payload.description_ru || '',
      unitEn: payload.unit_en || '',
      unitRu: payload.unit_ru || '',
    })

    await filter.save()

    await this.syncFilterPivot(payload.id, payload.categories)

    return filter.id
  }
  /**
   * Deletes filtes
   * @param filter filter
   * @returns is deleted
   */
  public async delete (filter: CategoryFilter) {
    await filter.related('locales')
      .query()
      .delete()
      .where('id', filter.id)

    await filter.delete()

    return filter.$isDeleted
  }
}
