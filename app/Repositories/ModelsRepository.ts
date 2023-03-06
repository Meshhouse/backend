import Database from '@ioc:Adonis/Lucid/Database'
import Model from 'App/Models/Model'
import ListModelValidator from 'App/Validators/Model/ListModelValidator'
import type {
  AccessoryModelFilter,
  SimilarModelFilter,
} from '@meshhouse/types'

export default class ModelsRepository {
  /**
   * Gets models with applying filters
   * @param payload payload
   * @param isAdminPanel is admin panel
   * @param matureContent show mature content
   * @param escapedQuery query search
   * @param language localization
   * @returns models
   */
  public async getWithFilters (
    payload: ListModelValidator['schema']['props'],
    matureContent: boolean | null,
    escapedQuery: string,
    language: string | null
  ) {
    return Model
      .query()
      .preload('category')
      .preload('properties')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .preload('filters')
      .select('id', 'slug', 'status', 'mature_content', 'brands', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .where((query) => {
        if (matureContent === false || matureContent === null) {
          query.where('mature_content', false)
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
      .leftJoin('models_localizations', 'models_localizations.rowid', 'models.id')
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
      /*
      .if(Array.isArray(payload.tags), (query) => {
        const tags = (payload.tags as string[])
        let regexText = ''
        tags.map((string, idx) => {
          regexText += string
          if (idx + 1 < tags.length) {
            regexText += '|'
          }
        })

        query
          .whereRaw(`models_localizations.tags_en regexp '\"(?:${regexText})'`)
          .orWhereRaw(`models_localizations.tags_ru regexp '\"(?:${regexText})'`)
      })*/
      .if(payload.sort && JSON.stringify(payload.sort) !== '{}', (query) => {
        let field = 'models.created_at'

        switch (payload.sort?.field) {
          case 'created_at':
          case 'updated_at': {
            field = `models.${payload.sort?.field}`
            break
          }
          case 'title': {
            field = `models_localizations.title_${language ? language : 'en'}`
            break
          }
        }

        query.orderBy(field, payload.sort?.direction)
      })
      .paginate(payload.page || 1, payload.count || 50)
  }
  /**
   * Gets models for admin panel
   * @param payload payload
   * @returns models
   */
  public async getList (payload: ListModelValidator['schema']['props']) {
    return Model
      .query()
      .preload('category')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'status', 'mature_content', 'thumbnail', 'created_at', 'updated_at')
      .paginate(payload.page || 1, payload.count || 50)
  }
  /**
   * Gets single model by slug
   * @param slug model slug
   * @returns model
   */
  public async getSingle (slug: string) {
    return Model
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
      .where({ slug })
      .firstOrFail()
  }
  /**
   * Gets single model by id
   * @param id model id
   * @returns model
   */
  public async getById (id: number) {
    return Model.findOrFail(id)
  }
  /**
   * Gets models by collection
   * @param ids collection ids
   * @param matureContent show mature content
   * @returns models
   */
  public async getByCollection (
    ids: number[],
    matureContent: boolean | null
  ) {
    return Model
      .query()
      .preload('category')
      .preload('collections')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'status', 'mature_content', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .whereHas('collections', (collectionsQuery) => {
        collectionsQuery
          .whereIn('collection_id', ids)
      })
      .where((query) => {
        if (matureContent === false || matureContent === null) {
          query.where('mature_content', false)
        }
      })
  }

  public async getModelStatistics () {
    return Database
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
  }

  public async getForAutocomplete (
    matureContent: boolean | null,
    searchQuery: string
  ) {
    return Model
      .query()
      .preload('category')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'mature_content', 'brands', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .where((query) => {
        if (matureContent === false || matureContent === null) {
          query.where('mature_content', false)
        }
      })
      .whereHas('locales', (localesQuery) => {
        localesQuery
          .where('models_localizations', 'match', searchQuery)
      })
      .limit(5)
  }

  public async getForExport () {
    return Model
      .query()
      .preload('category')
      .preload('properties')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'status', 'mature_content', 'brands', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .leftJoin('models_localizations', 'models_localizations.rowid', 'models.id')
  }

  public async getForFavorites (ids: number[]) {
    return Model
      .query()
      .preload('category')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'status', 'mature_content', 'brands', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .whereIn('id', ids)
  }
  /**
   * Get similar models
   * @param model original model
   * @param conditions similarity conditions
   * @returns similar models
   */
  public async getSimilar (model: Model, conditions: SimilarModelFilter[][]) {
    return Model
      .query()
      .preload('category')
      .preload('properties')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .preload('filters')
      .select('id', 'slug', 'status', 'mature_content', 'brands', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .leftJoin('models_localizations', 'models_localizations.rowid', 'models.id')
      .whereHas('category', (query) => {
        query.whereIn('category_model.category_id', [model.category[0].id])
      })
      .where((query) => {
        if (!model.matureContent) {
          query.where('mature_content', false)
        }
      })
      .whereNot('id', model.id)
      .whereHas('filters', (query) => {
        conditions.map((condition) => {
          condition.map((filter) => {
            let currentModelValue: any = model.filters.find((val) => val.filterId === filter.filter_id)?.value
            const filterValue: any = filter.value

            if (filter.operand === 'between') {
              currentModelValue = parseFloat(currentModelValue)
              query.andWhereRaw(`exists (select * from 'model_category_filters' where 'model_category_filters'.'filter_id' = ${filter.filter_id} and 'model_category_filters'.'value' between ${currentModelValue - filterValue} and ${currentModelValue + filterValue} and model_category_filters.model_id = models.id)`)
            } else {
              query.andWhereRaw(`exists (select * from 'model_category_filters' where 'model_category_filters'.'filter_id' = ${filter.filter_id} and 'model_category_filters'.'value' = ${currentModelValue} and model_category_filters.model_id = models.id)`)
            }
          })
        })
      })
      .limit(10)
  }
  /**
   * Get model accessories
   * @param model original model
   * @param category category id
   * @param conditions accessories conditions
   * @returns model accessories
   */
  public async getAccessories (model: Model, category: number, conditions: AccessoryModelFilter[]) {
    return Model
      .query()
      .preload('category')
      .preload('properties')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .preload('filters')
      .select('id', 'slug', 'status', 'mature_content', 'brands', 'thumbnail', 'created_at', 'updated_at')
      .where('status', 1)
      .leftJoin('models_localizations', 'models_localizations.rowid', 'models.id')
      .whereHas('category', (query) => {
        query.whereIn('category_model.category_id', [category])
      })
      .where((query) => {
        if (!model.matureContent) {
          query.where('mature_content', false)
        }
      })
      .whereNot('id', model.id)
      .whereHas('filters', (query) => {
        conditions.map((filter) => {
          let currentModelValue: any = model.filters.find((val) => val.filterId === filter.filter_id)?.value
          const filterValue: any = filter.value

          if (filter.operand === 'between') {
            currentModelValue = parseFloat(currentModelValue)
            query.andWhereRaw(`exists (select * from 'model_category_filters' where 'model_category_filters'.'filter_id' = ${filter.filter_id} and 'model_category_filters'.'value' between ${currentModelValue - filterValue} and ${currentModelValue + filterValue} and model_category_filters.model_id = models.id)`)
          } else {
            if (filter.mapper === false) {
              currentModelValue = filter.value
            } else {
              // @TODO make filter mapper
            }

            if (currentModelValue !== undefined) {
              query.andWhereRaw(`exists (select * from 'model_category_filters' where 'model_category_filters'.'filter_id' = ${filter.filter_id} and 'model_category_filters'.'value' = '${currentModelValue}' and model_category_filters.model_id = models.id)`)
            }
          }
        })
      })
      .limit(10)
  }
}
