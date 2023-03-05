import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/fold'
import { ModelFull } from '@meshhouse/types'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateModelValidator from 'App/Validators/Model/CreateModelValidator'
import UpdateModelValidator from 'App/Validators/Model/UpdateModelValidator'
import ModelCategoryFilter from 'App/Models/ModelCategoryFilter'
import CategoryFilter from 'App/Models/CategoryFilter'
import Model from 'App/Models/Model'
import type { ModelSimple } from '@meshhouse/types'
import { CrayaExportInterface } from 'Contracts/interfaces'
import ImageService from 'App/Services/ImageService'

@inject()
export default class ModelsService {
  constructor (
    public ImageService: ImageService
  ) {}

  /**
   * Prepares model for frontend
   * @param models models
   * @param language localization
   * @returns
   */
  public prepareModels (
    models: ModelPaginatorContract<Model>,
    language: string | null
  ) {
    const serialized = models.serialize({
      relations: {
        locales: {
          fields: ['title_en', 'title_ru'],
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
        } else {
          item.title = item.locales[`title_${language}`]
        }

        item.category = item.category[0].slug

        item.available_formats = []

        item.files.map((file) => {
          if (!item.available_formats.includes(file.program)) {
            item.available_formats.push(file.program)
          }
        })

        item.copyrighted_content = item.brands.length > 0

        delete item.locales
        delete item.properties
        delete item.files
        delete item.filters
        delete item.brands

        return item as ModelSimple
      }),
    }
  }
  /**
   * Prepares model for admin panel
   * @param models models
   * @returns
   */
  public prepareModelsForAdmin (models: ModelPaginatorContract<Model>) {
    const serialized = models.serialize({
      relations: {
        locales: {
          fields: ['title_en', 'title_ru'],
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
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru

        item.category = item.category[0].slug

        delete item.locales
        delete item.properties
        delete item.files
        delete item.filters

        return item as ModelSimple
      }),
    }
  }
  /**
   * Prepares models for favorites list
   * @param models
   * @returns
   */
  public prepareModelsFavorite (models: Model[], language: string | null) {
    return models.map((model) => {
      const item = model.toJSON()

      if (!language) {
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru
      } else {
        item.title = item.locales[`title_${language}`]
      }

      item.category = item.category[0].slug

      item.available_formats = []

      item.files.map((file) => {
        if (!item.available_formats.includes(file.program)) {
          item.available_formats.push(file.program)
        }
      })

      item.copyrighted_content = item.brands.length > 0

      delete item.locales
      delete item.properties
      delete item.files
      delete item.filters
      delete item.brands
      delete item.status

      return item as ModelSimple
    })
  }
  /**
   * Prepares single model
   * @param model model
   * @param ctx context
   * @param language localization
   * @param isAdminPanel is admin panel
   * @returns
   */
  public async prepareSingleModel (
    model: Model,
    ctx: HttpContextContract
  ) {
    const categoryFilters = await CategoryFilter
      .query()
      .select('category_filters.id', 'key', 'category_filters.multiple_values')
      .leftJoin('category_filters_pivot', 'category_filters.id', 'category_filters_pivot.filter_id')
      .where('category_filters_pivot.category_id', model.category[0].id)

    const serialized = model.serialize()

    if (await ctx.bouncer.denies('viewModel', model)) {
      if (serialized.status === 0) {
        ctx.response.abort('Not found', 404)
      }

      if (serialized.status === 2) {
        ctx.response.abort('Locked', 451)
      }
    }

    if (!ctx.xLanguage) {
      serialized.title_en = serialized.locales.title_en
      serialized.title_ru = serialized.locales.title_ru
      serialized.description_en = serialized.locales.description_en
      serialized.description_ru = serialized.locales.description_ru
      serialized.tags_en = serialized.locales.tags_en
      serialized.tags_ru = serialized.locales.tags_ru
    } else {
      serialized.title = serialized.locales[`title_${ctx.xLanguage}`]
      serialized.description = serialized.locales[`description_${ctx.xLanguage}`]
      serialized.tags = serialized.locales[`tags_${ctx.xLanguage}`]
    }

    serialized.brands = serialized.brands || []
    serialized.licenses = serialized.licenses !== '[]'
      ? serialized.licenses.split(',').filter(v => v).map(v => Number(v))
      : []

    try {
      serialized.images = JSON.parse(serialized.images || '[]')
    } catch (error) {}

    serialized.polygons = serialized.properties.polygons
    serialized.vertices = serialized.properties.vertices
    serialized.blendshapes = serialized.properties.blendshapes
    serialized.rig = serialized.properties.rig === '0'
      ? false
      : serialized.properties.rig
    serialized.hair_system = serialized.properties.hair_system === '0'
      ? false
      : serialized.properties.hair_system
    serialized.textures = serialized.properties.textures === '0'
      ? false
      : serialized.properties.textures
    serialized.uv = serialized.properties.uv === '0'
      ? false
      : serialized.properties.uv

    delete serialized.locales
    delete serialized.properties

    if (!ctx.xAdminPanel) {
      delete serialized.status
    }

    serialized.files = serialized.files.map((file) => {
      return {
        ...file,
        model_id: undefined,
      }
    })

    serialized.category = serialized.category[0]

    if (!ctx.xLanguage) {
      serialized.category.title_en = serialized.category.locales.title_en
      serialized.category.title_ru = serialized.category.locales.title_ru
      serialized.category.description_en = serialized.category.locales.description_en
      serialized.category.description_ru = serialized.category.locales.description_ru
    } else {
      serialized.category.title = serialized.category.locales[`title_${ctx.xLanguage}`]
      serialized.category.description = serialized.category.locales[`description_${ctx.xLanguage}`]
    }ctx.xLanguage

    serialized.collections = serialized.collections.map((collection) => {
      return {
        id: collection.id,
        slug: collection.slug,
        title: ctx.xLanguage ? collection.locales[`title_${ctx.xLanguage}`] : undefined,
        title_en: !ctx.xLanguage ? collection.locales.title_en : undefined,
        title_ru: !ctx.xLanguage ? collection.locales.title_ru : undefined,
      }
    })

    if (!ctx.xLanguage) {
      serialized.collections.title_en = serialized.category.locales.title_en
      serialized.category.title_ru = serialized.category.locales.title_ru
      serialized.category.description_en = serialized.category.locales.description_en
      serialized.category.description_ru = serialized.category.locales.description_ru
    } else {
      serialized.category.title = serialized.category.locales[`title_${ctx.xLanguage}`]
      serialized.category.description = serialized.category.locales[`description_${ctx.xLanguage}`]
    }

    serialized.filters = {}

    for (const filter of categoryFilters) {
      const modelValues = model.filters.filter((val) => val.filterId === filter.id)

      if (filter.multipleValues) {
        serialized.filters[filter.key] = modelValues.length > 0 ? modelValues.map(v => v.value) : ''
      } else {
        serialized.filters[filter.key] = modelValues.length > 0 ? modelValues[0].value : ''
      }
    }

    delete serialized.category.locales

    return serialized as ModelFull
  }
  /**
   * Creates new model
   * @param payload payload
   * @returns model id
   */
  public async createModel (payload: CreateModelValidator['schema']['props']) {
    const model = await Model.create({
      slug: payload.slug,
      brands: payload.brands,
      status: payload.status,
      matureContent: payload.mature_content,
      installPaths: payload.install_paths,
      texturesLink: payload.textures_link,
      texturesLinkSize: payload.textures_link_size,
      thumbnail: payload.thumbnail,
      images: payload.images,
      licenses: payload.licenses,
      preview: null,
    })

    await model.related('category').attach([payload.category])

    await Database.table('models_localizations').returning('rowid').insert({
      title_ru: payload.title_ru,
      title_en: payload.title_en,
      description_en: payload.description_en || '',
      description_ru: payload.description_ru || '',
      tags_en: JSON.stringify(payload.tags_en || []),
      tags_ru: JSON.stringify(payload.tags_ru || []),
      rowid: model.id,
    })

    await model.related('properties').create({
      polygons: payload.properties.polygons,
      vertices: payload.properties.vertices,
      blendshapes: payload.properties.blendshapes,
      rig: payload.properties.rig,
      hairSystem: payload.properties.hair_system,
      textures: payload.properties.textures,
      uv: payload.properties.uv,
    })

    const files = payload.files.map((file) => {
      return {
        ...file,
        model_id: model.id,
        size: file.size || 0,
      }
    })

    await model.related('files').createMany(files)
    await model.related('collections').sync(payload.collections || [])

    return model.id
  }
  /**
   * Updates model
   * @param model model
   * @param payload payload
   * @returns
   */
  public async updateModel (model: Model, payload: UpdateModelValidator['schema']['props']) {
    const categoryFilters = await CategoryFilter
      .query()
      .select('category_filters.id', 'category_id', 'key', 'multiple_values')
      .leftJoin('category_filters_pivot', 'category_filters.id', 'category_filters_pivot.filter_id')
      .where('category_id', payload.category)

    model.slug = payload.slug
    model.status = payload.status
    model.brands = payload.brands
    model.licenses = payload.licenses
    model.matureContent = payload.mature_content
    model.installPaths = payload.install_paths
    model.texturesLink = payload.textures_link || ''
    model.texturesLinkSize = payload.textures_link_size
    model.thumbnail = payload.thumbnail
    model.images = payload.images
    model.preview = null

    await Database.from('models_localizations').where('rowid', payload.id).update({
      title_ru: payload.title_ru,
      title_en: payload.title_en,
      description_en: payload.description_en || '',
      description_ru: payload.description_ru || '',
      tags_en: JSON.stringify(payload.tags_en || []),
      tags_ru: JSON.stringify(payload.tags_ru || []),
    })

    await model.related('properties').updateOrCreate({}, {
      polygons: payload.properties.polygons,
      vertices: payload.properties.vertices,
      blendshapes: payload.properties.blendshapes,
      rig: payload.properties.rig,
      hairSystem: payload.properties.hair_system,
      textures: payload.properties.textures,
      uv: payload.properties.uv,
    })

    const files = payload.files.map((file) => {
      return {
        ...file,
        model_id: model.id,
        size: file.size || 0,
      }
    })

    for (const filter of categoryFilters) {
      const payloadFilter = payload.filters[filter.key]

      if (Array.isArray(payloadFilter) && filter.multipleValues === true) {
        await this.syncMultipleValueFilter(payload.id, filter.id, payloadFilter)
      } else {
        await ModelCategoryFilter.updateOrCreate({ modelId: payload.id, filterId: filter.id }, {
          modelId: payload.id,
          filterId: filter.id,
          value: payloadFilter,
        })
      }
    }

    await model.related('files').updateOrCreateMany(files, 'url')
    await model.related('category').sync([payload.category])
    await model.related('collections').sync(payload.collections || [])
    await model.save()

    return model.id
  }
  /**
   * Deletes model
   * @param model model
   * @returns is deleted
   */
  public async deleteModel (model: Model) {
    await model.related('locales')
      .query()
      .delete()
      .where('rowid', model.id)
    await model.related('properties')
      .query()
      .delete()
      .where('id', model.id)

    await ModelCategoryFilter
      .query()
      .delete()
      .where('model_id', model.id)

    await model.delete()

    return model.$isDeleted
  }
  /**
   * Prepares model collections
   * @param models models
   * @param language localization
   * @returns
   */
  public prepareModelCollections (
    models: Model[],
    language: string | null
  ) {
    const collections = {}

    models.map((model) => {
      const item = model.toJSON()

      if (!language) {
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru
      } else {
        item.title = item.locales[`title_${language}`]
      }

      delete item.locales
      delete item.status

      item.category = item.category[0].slug
      item.collections = item.collections.map(collection => collection.id)

      item.collections.map((collection) => {
        if (!Array.isArray(collections[collection])) {
          collections[collection] = []
        }

        if (!collections[collection].find((val) => val.id === item.id)) {
          collections[collection].push(item)
        }
      })
    })

    return collections
  }

  public prepareForExport (models: Model[]) {
    const array: CrayaExportInterface[] = models.map((model) => {
      const url = Env.get('SITE_URL') + 'models/' + model.category[0].slug + '/' + model.slug
      const formats = Array.from(new Set(model.files.map((file) => {
        switch (file.program) {
          case '3ds_max':
            return '3ds max'
          case 'cinema4d':
            return 'cinema 4d'
          case 'unreal_engine':
            return 'unreal engine'
          default:
            return file.program.replace('_', ' ')
        }
      })))

      return {
        id: `MESHHOUSE-${model.id}`,
        title: model.locales.titleEn,
        thumbnail: this.ImageService.translateDomain(model.thumbnail),
        description: model.locales.descriptionEn,
        formats,
        tags: model.locales.tagsEn,
        url,
        provider: 'meshhouse',
        mature_content: model.matureContent,
        price: 0,
      }
    })

    return array
  }
  /**
   * Syncs multiple values filter
   * @param modelId model id
   * @param filterId filter id
   * @param values new values
   */
  public async syncMultipleValueFilter (modelId: number, filterId: number, values: (string | number)[]) {
    const originalValues = (await ModelCategoryFilter
      .query()
      .select('id', 'model_id', 'filter_id', 'value')
      .where('model_id', modelId)
      .andWhere('filter_id', filterId)
    ).map((val) => val.value as string | number)

    const addedValues = values.filter((x: string | number) => !originalValues.includes(x))
    const removedValues = originalValues.filter((x: string | number) => !values.includes(x))

    if (addedValues.length > 0) {
      await ModelCategoryFilter.createMany(addedValues.map((value) => {
        return {
          modelId,
          filterId,
          value,
        }
      }))
    }

    if (removedValues.length > 0) {
      await ModelCategoryFilter
        .query()
        .where('model_id', modelId)
        .andWhere('filter_id', filterId)
        .andWhereIn('value', removedValues)
        .delete()
    }
  }
}
