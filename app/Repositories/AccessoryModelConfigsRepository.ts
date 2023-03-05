import { inject } from '@adonisjs/fold'
import AccessoryModelConfig from 'App/Models/AccessoryModelConfig'
import Model from 'App/Models/Model'
import CategoryFiltersRepository from 'App/Repositories/CategoryFiltersRepository'
import type {
  AccessoryModelFilter,
} from '@meshhouse/types'

@inject()
export default class AccessoryModelConfigsRepository {
  constructor (
    public CategoryFiltersRepository: CategoryFiltersRepository
  ) { }
  /**
   * Gets model config by id
   * @param id id
   * @returns model config
   */
  public async get (id: number) {
    return AccessoryModelConfig.findOrFail(id)
  }
  /**
   * Calculates accessory model conditions
   * @param slug source model slug
   * @returns model conditions
   */
  public async calculateModelConditions (slug: string) {
    const model = await Model
      .query()
      .preload('category', (categoryQuery) => {
        categoryQuery.preload('locales')
      })
      .preload('filters')
      .preload('properties')
      .select('*')
      .where({ slug })
      .firstOrFail()

    const categoryId = model.category[0].id
    const categoryFilters = await this.CategoryFiltersRepository.getByCategorySimple(categoryId)

    const modelConfig = await AccessoryModelConfig.findOrFail(categoryId)

    let modelConditions: { category_id: number; filters: AccessoryModelFilter[] }[] = []

    if (modelConfig.preConditions.length === 0) {
      modelConditions = modelConfig.postConditions.map((condition) => condition.accessories).flat()
    } else {
      modelConfig.preConditions
        .filter((condition) => {
          let value: unknown = ''

          const filterType = categoryFilters.find((filter) => filter.id === condition.filter_id)?.type
          const modelFilter = model.filters.find((filter) => filter.filterId === condition.filter_id)

          if (modelFilter) {
            value = modelFilter.value

            if (filterType === 'range') {
              value = parseFloat(modelFilter.value as string)
            }
          }

          return modelFilter && (condition.value !== null ? value === condition.value : true)
        })
        .map((condition) => {
          const filters = modelConfig.postConditions.find((val) => val.condition_id === condition.condition_id)

          if (filters) {
            modelConditions.push(...filters.accessories)
          }
        })
    }

    return {
      model,
      conditions: modelConditions,
    }
  }
}
