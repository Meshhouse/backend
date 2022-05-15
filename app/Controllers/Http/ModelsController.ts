import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import Model from 'App/Models/Model'
import CategoryFilter from 'App/Models/CategoryFilter'
import ModelCategoryFilter from 'App/Models/ModelCategoryFilter'
import CreateModelValidator from 'App/Validators/CreateModelValidator'
import UpdateModelValidator from 'App/Validators/UpdateModelValidator'
import ListModelValidator from 'App/Validators/ListModelValidator'
import { ModelContract, ModelSimple, ModelFull } from 'Contracts/Model'

export default class ModelsController {
  /**
   * Get models
   * @param ctx context
   * @returns models or error
   */
  public async list (ctx: HttpContextContract): Promise<ModelContract> {
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
      'x-meshhouse-mature-content': schema.boolean.optional(),
    })

    const payload = await ctx.request.validate(ListModelValidator)
    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const language = headers['x-meshhouse-language'] ?? null
    const matureContent = headers['x-meshhouse-mature-content'] ?? null
    let isAdminPanel = false

    if (await ctx.bouncer.allows('viewAdmin')) {
      isAdminPanel = true
    }

    let escapedQuery = string.escapeHTML(String(payload.query).toLowerCase()).replace(/[^a-zA-Z0-9_ ]+/gmu, '')

    const models = await Model
      .query()
      .preload('category')
      .preload('properties')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .preload('filters')
      .select('id', 'slug', 'status', 'mature_content', 'thumbnail', 'created_at', 'updated_at')
      .where((query) => {
        if (!isAdminPanel && (matureContent === false || matureContent === null)) {
          query.where('mature_content', false)
        }
      })
      .where((query) => {
        if (isAdminPanel === false || isAdminPanel === null) {
          query.where('status', 1)
        }
      })
      .whereHas('files', (query) => {
        if (payload.filters && Array.isArray(payload.filters?.formats) && payload.filters.formats.length > 0) {
          query.whereIn(
            'model_files.program',
            Array.from(new Set(payload.filters?.formats?.map((format) => format.program)))
          )
            .andWhereIn(
              'model_files.program_version',
              Array.from(new Set(payload.filters?.formats?.map((format) => format.program_version)))
            )
        }

        if (payload.filters && Array.isArray(payload.filters?.renderers) && payload.filters.renderers.length > 0) {
          query.whereIn(
            'model_files.renderer',
            Array.from(new Set(payload.filters?.renderers?.map((renderer) => renderer.renderer)))
          )
            .andWhereIn(
              'model_files.renderer_version',
              Array.from(new Set(payload.filters?.renderers?.map((renderer) => renderer.renderer_version || '')))
            )
        }
      })
      .whereHas('properties', (query) => {
        // Polygons filter
        if (payload.filters?.polys === 'hi-poly') {
          query.where('models_properties.polygons', '>=', 20000)
        }
        if (payload.filters?.polys === 'mid-poly') {
          query.where('models_properties.polygons', '>=', 1500)
            .andWhere('models_properties.polygons', '<', 20000)
        }
        if (payload.filters?.polys === 'low-poly') {
          query.where('models_properties.polygons', '<', 1500)
        }

        if (payload.filters?.hair_system) {
          query.where('models_properties.hair_system', '=', payload.filters?.hair_system)
        }
        if (payload.filters?.rig) {
          query.where('models_properties.rig', '=', payload.filters?.rig)
        }
        if (payload.filters?.textures) {
          query.where('models_properties.textures', '=', payload.filters?.textures)
        }
        if (payload.filters?.uv) {
          query.where('models_properties.uv', '=', payload.filters?.uv)
        }
      })
      .whereHas('locales', (query) => {
        if (payload.query) {
          query.where('models_localizations', 'match', escapedQuery)
        }
      })
      .whereHas('category', (query) => {
        if (Array.isArray(payload.categories) && payload.categories.length > 0) {
          query.whereIn('category_model.category_id', payload.categories)
        }
      })
      .if(payload.custom_filters && JSON.stringify(payload.custom_filters) !== '{}', (query) => {
        query.whereHas('filters', (query) => {
          for (const key in payload.custom_filters) {
            if (typeof payload.custom_filters[key][0] === 'string') {
              query
                .where('model_category_filters.filter_id', key)
                .andWhereIn('model_category_filters.value', payload.custom_filters[key])
            } else {
              query
                .where('model_category_filters.filter_id', key)
                .andWhereBetween('model_category_filters.value', payload.custom_filters[key])
            }
          }
        })
      })
      .paginate(payload.page || 1, payload.count || 50)

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

        delete item.locales
        delete item.properties
        delete item.files
        delete item.filters

        if (!isAdminPanel) {
          delete item.status
        }

        return item as ModelSimple
      }),
    }
  }
  /**
   * Get model by slug
   * @param ctx context
   * @returns model or error
   */
  public async single (ctx: HttpContextContract): Promise<ModelFull> {
    const validateSchema = schema.create({
      params: schema
        .object()
        .members({
          slug: schema.string(),
        }),
    })
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const language = headers['x-meshhouse-language'] ?? null
    let isAdminPanel = false

    if (await ctx.bouncer.allows('viewAdmin')) {
      isAdminPanel = true
    }

    const model = await Model
      .query()
      .preload('collections', (collectionsQuery) => {
        collectionsQuery.preload('locales')
      })
      .preload('category', (categoryQuery) => {
        categoryQuery.preload('locales')
      })
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .preload('filters')
      .preload('properties')
      .preload('files')
      .select('*')
      .where({ slug: payload.params.slug })
      .firstOrFail()

    const categoryFilters = await CategoryFilter
      .query()
      .select('id', 'category', 'key')
      .where('category', model.category[0].id)

    const serialized = model.serialize()

    if (await ctx.bouncer.denies('viewModel', model)) {
      if (serialized.status === 0) {
        ctx.response.abort('Not found', 404)
      }

      if (serialized.status === 2) {
        ctx.response.abort('Locked', 451)
      }
    }

    if (!language) {
      serialized.title_en = serialized.locales.title_en
      serialized.title_ru = serialized.locales.title_ru
      serialized.description_en = serialized.locales.description_en
      serialized.description_ru = serialized.locales.description_ru
      serialized.tags_en = serialized.locales.tags_en.split(',').filter(v => v)
      serialized.tags_ru = serialized.locales.tags_ru.split(',').filter(v => v)
    } else {
      serialized.title = serialized.locales[`title_${language}`]
      serialized.description = serialized.locales[`description_${language}`]
      serialized.tags = serialized.locales[`tags_${language}`].split(',').filter(v => v)
    }

    serialized.brands = serialized.brands.split(',').filter(v => v)
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

    if (!isAdminPanel) {
      delete serialized.status
    }

    serialized.files = serialized.files.map((file) => {
      return {
        ...file,
        model_id: undefined,
      }
    })

    serialized.category = serialized.category[0]

    if (!language) {
      serialized.category.title_en = serialized.category.locales.title_en
      serialized.category.title_ru = serialized.category.locales.title_ru
      serialized.category.description_en = serialized.category.locales.description_en
      serialized.category.description_ru = serialized.category.locales.description_ru
    } else {
      serialized.category.title = serialized.category.locales[`title_${language}`]
      serialized.category.description = serialized.category.locales[`description_${language}`]
    }

    serialized.collections = serialized.collections.map((collection) => {
      return {
        id: collection.id,
        slug: collection.slug,
        title: language ? collection.locales[`title_${language}`] : undefined,
        title_en: !language ? collection.locales.title_en : undefined,
        title_ru: !language ? collection.locales.title_ru : undefined,
      }
    })

    if (!language) {
      serialized.collections.title_en = serialized.category.locales.title_en
      serialized.category.title_ru = serialized.category.locales.title_ru
      serialized.category.description_en = serialized.category.locales.description_en
      serialized.category.description_ru = serialized.category.locales.description_ru
    } else {
      serialized.category.title = serialized.category.locales[`title_${language}`]
      serialized.category.description = serialized.category.locales[`description_${language}`]
    }

    serialized.filters = {}

    for (const filter of categoryFilters) {
      const modelValue = model.filters.find((val) => val.filterId === filter.id)

      serialized.filters[filter.key] = modelValue ? modelValue.value : ''
    }

    delete serialized.category.locales

    return serialized as ModelFull
  }
  /**
   * Create model
   * @param ctx context
   * @returns model id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateModelValidator)
    await ctx.bouncer.authorize('viewAdmin')

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
      tags_en: payload.tags_en || '[]',
      tags_ru: payload.tags_ru || '[]',
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
   * Update model
   * @param ctx context
   * @returns model id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateModelValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const model = await Model.findOrFail(payload.id)
    const categoryFilters = await CategoryFilter
      .query()
      .select('id', 'category', 'key')
      .where('category', payload.category)

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
      tags_en: payload.tags_en || '[]',
      tags_ru: payload.tags_ru || '[]',
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

      await ModelCategoryFilter.updateOrCreate({ modelId: payload.id, filterId: filter.id }, {
        modelId: payload.id,
        filterId: filter.id,
        value: payloadFilter,
      })
    }

    await model.related('files').updateOrCreateMany(files, 'url')
    await model.related('category').sync([payload.category])
    await model.related('collections').sync(payload.collections || [])
    await model.save()

    return model.id
  }
  /**
   * Delete model
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const model = await Model.findOrFail(payload.id)
    await model.related('locales')
      .query()
      .delete()
      .where('rowid', payload.id)
    await model.related('properties')
      .query()
      .delete()
      .where('id', payload.id)

    await ModelCategoryFilter
      .query()
      .delete()
      .where('model_id', payload.id)

    await model.delete()

    return model.$isDeleted
  }
  /**
   * Get models list by collection
   * @param ctx context
   * @returns model collections
   */
  public async listCollection (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      ids: schema.array().members(schema.number()),
    })
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
      'x-meshhouse-mature-content': schema.boolean.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const language = headers['x-meshhouse-language'] ?? null
    const matureContent = headers['x-meshhouse-mature-content'] ?? null
    let isAdminPanel = false

    if (await ctx.bouncer.allows('viewAdmin')) {
      isAdminPanel = true
    }

    const models = await Model
      .query()
      .preload('category')
      .preload('collections')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'status', 'mature_content', 'thumbnail', 'created_at', 'updated_at')
      .whereHas('collections', (collectionsQuery) => {
        collectionsQuery
          .whereIn('collection_id', payload.ids)
      })
      .where((query) => {
        if (!isAdminPanel && (matureContent === false || matureContent === null)) {
          query.where('mature_content', false)
        }
      })
      .where((query) => {
        if (isAdminPanel === false || isAdminPanel === null) {
          query.where('status', 1)
        }
      })

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

      item.category = item.category[0].slug
      item.collections = item.collections.map(collection => collection.id)

      if (!isAdminPanel) {
        delete item.status
      }

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
  /**
   * Get models count
   * @returns count
   */
  public async statistics () {
    const stats = await Database
      .rawQuery(`
        SELECT
        SUM(model_files.program = '3ds_max') AS 'max',
        SUM(model_files.program = 'maya') AS 'maya',
        SUM(model_files.program = 'blender') AS 'blender',
        SUM(model_files.program = 'cinema4d') AS 'c4d',
        SUM(model_files.program = 'unity') AS 'unity',
        SUM(model_files.program = 'unreal_engine') AS 'unreal'
        FROM model_files
      `)

    return {
      stats: stats[0],
    }
  }
}
