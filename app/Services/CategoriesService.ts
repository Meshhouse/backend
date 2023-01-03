import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { inject } from '@adonisjs/fold'
import Category from 'App/Models/Category'
import Block from 'App/Models/Block'
import CategoryFiltersRepository from 'App/Repositories/CategoryFiltersRepository'
import CreateCategoryValidator from 'App/Validators/Category/CreateCategoryValidator'
import UpdateCategoryValidator from 'App/Validators/Category/UpdateCategoryValidator'
import { Category as CategoryType } from '@meshhouse/types'

@inject()
export default class CategoriesService {
  constructor (
    public CategoryFiltersRepository: CategoryFiltersRepository
  ) {}

  public prepareList (
    categories: ModelPaginatorContract<Category>,
    language: string | null
  ) {
    const serialized = categories.serialize({
      relations: {
        locales: {
          fields: ['title_en', 'title_ru', 'description_en', 'description_ru'],
        },
      },
    })

    return {
      pagination: {
        total: serialized.meta.total,
        current_page: serialized.meta.current_page,
        last_page: serialized.meta.last_page,
      },
      items: serialized.data.map((item) => {
        if (!language) {
          item.title_en = item.locales.title_en
          item.title_ru = item.locales.title_ru
          item.description_en = item.locales.description_en
          item.description_ru = item.locales.description_ru
        } else {
          item.title = item.locales[`title_${language}`]
          item.description = item.locales[`description_${language}`]
        }

        delete item.locales

        return item as CategoryType
      }),
    }
  }

  public prepareTree (
    categories: Category[],
    language: string | null
  ) {
    const array: CategoryType[] = []

    categories.map((category) => {
      const item = category.toJSON()

      if (!language) {
        item.title_en = category.locales.titleEn
        item.title_ru = category.locales.titleRu
        item.description_en = category.locales.descriptionEn
        item.description_ru = category.locales.descriptionRu
      } else {
        item.title = category.locales[`title${language[0].toUpperCase() + language.slice(1)}`]
        item.description = category.locales[`description${language[0].toUpperCase() + language.slice(1)}`]
      }

      delete item.locales

      if (item.parent_id === null) {
        item.childrens = []

        array.push(item as CategoryType)
      }
    })

    categories.map((category) => {
      const item = category.toJSON()

      if (!language) {
        item.title_en = category.locales.titleEn
        item.title_ru = category.locales.titleRu
        item.description_en = category.locales.descriptionEn
        item.description_ru = category.locales.descriptionRu
      } else {
        item.title = category.locales[`title${language[0].toUpperCase() + language.slice(1)}`]
        item.description = category.locales[`description${language[0].toUpperCase() + language.slice(1)}`]
      }

      delete item.locales

      if (item.parent_id !== null) {
        const idx = array.findIndex((val) => val.id === item.parent_id)
        if (idx !== -1) {
          (array[idx].childrens as CategoryType[]).push(item as CategoryType)
        }
      }
    })

    return array
  }

  public prepareSingle (category: Category) {
    const item = category.toJSON()

    item.title_en = category.locales.titleEn
    item.title_ru = category.locales.titleRu
    item.description_en = category.locales.descriptionEn
    item.description_ru = category.locales.descriptionRu

    delete item.locales

    return item
  }

  public async create (payload: CreateCategoryValidator['schema']['props']) {
    const category = await Category.create({
      slug: payload.slug,
      icon: payload.icon ?? '',
      parentId: payload.parent_id ?? null,
      order: payload.order,
    })

    await category.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en,
      descriptionRu: payload.description_ru,
    })

    return category.id
  }

  public async update (
    category: Category,
    payload: UpdateCategoryValidator['schema']['props']
  ) {
    category.slug = payload.slug
    category.icon = payload.icon ?? ''
    category.parentId = payload.parent_id ?? null
    category.order = payload.order

    await category.related('locales').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en || '',
      descriptionRu: payload.description_ru || '',
    })

    await category.save()

    return category.id
  }

  public async delete (category: Category) {
    await category.related('locales')
      .query()
      .delete()
      .where('id', category.id)

    await category.delete()

    return category.$isDeleted
  }

  public async getFilters (
    block: Block,
    id: string,
    language: string | null
  ) {
    let categoryFilters: any[] = []

    categoryFilters.push(...block.content.sort((a, b) => a.order - b.order).map((item) => {
      if (language) {
        item.title = item[`title_${language}`]

        delete item.title_en
        delete item.title_ru
      }

      if (item.type !== 'range') {
        item.values = item.values.map((val) => {
          if (language) {
            val.title = val[`title_${language}`]

            delete val.title_en
            delete val.title_ru
          }

          return val
        })
      } else {
        item.values = item.values.map((val) => {
          return {
            min: Number(val.min),
            max: Number(val.max),
          }
        })
      }

      return item
    }))

    if (id && id !== 'null') {
      const filters = await this.CategoryFiltersRepository.getByCategorySimple(Number(id))

      categoryFilters.push(...filters.sort((a, b) => a.order - b.order).map((filter) => {
        const item = filter.toJSON()

        if (!language) {
          item.title_en = item.locales.title_en
          item.title_ru = item.locales.title_ru
        } else {
          item.title = item.locales[`title_${language}`]
        }

        delete item.locales

        if (item.type !== 'range') {
          item.values = item.values.map((val) => {
            if (language) {
              val.title = val[`title_${language}`]

              delete val.title_en
              delete val.title_ru
            }

            return val
          })
        } else {
          item.values = item.values.map((val) => {
            return {
              min: Number(val.min),
              max: Number(val.max),
            }
          })
        }

        return item
      }))
    }

    return categoryFilters
  }
}
