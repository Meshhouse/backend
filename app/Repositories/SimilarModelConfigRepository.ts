import { inject } from '@adonisjs/fold'
import SimilarModelConfig from 'App/Models/SimilarModelConfig'
import Model from 'App/Models/Model'
import CategoryFiltersRepository from 'App/Repositories/CategoryFiltersRepository'
import type {
  SimilarModelFilter,
} from '@meshhouse/types'

@inject()
export default class SimilarModelConfigRepository {
  constructor (
    public CategoryFiltersRepository: CategoryFiltersRepository
  ) {}
  /**
   * Gets model config by id
   * @param id id
   * @returns model config
   */
  public async get (id: number) {
    return SimilarModelConfig.findOrFail(id)
  }
  /**
   * Calculates similar model conditions
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

    const modelConfig = await SimilarModelConfig.findOrFail(categoryId)

    let modelConditions: SimilarModelFilter[][] = []

    if (modelConfig.preConditions.length === 0) {
      modelConditions = modelConfig.postConditions.map((condition) => condition.filters)
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

          return modelFilter && value === condition.value
        })
        .map((condition) => {
          const filters = modelConfig.postConditions.find((val) => val.condition_id === condition.condition_id)

          if (filters) {
            modelConditions.push(filters.filters)
          }
        })
    }

    return {
      model,
      conditions: modelConditions,
      category_filters: categoryFilters,
    }
  }
}
