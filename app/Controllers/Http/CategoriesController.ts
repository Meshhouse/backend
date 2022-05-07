import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'
import CreateCategoryValidator from 'App/Validators/CreateCategoryValidator'
import UpdateCategoryValidator from 'App/Validators/UpdateCategoryValidator'
import { CategoryContract, CategoryModel } from 'Contracts/Category'

export default class CategoriesController {
  /**
   * Get categories
   * @param ctx context
   * @returns categories
   */
  public async list (ctx: HttpContextContract): Promise<CategoryContract> {
    const validateSchema = schema.create({
      page: schema.number.optional(),
      count: schema.number.optional(),
      roots_only: schema.boolean.optional(),
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

    const categories = await Category
      .query()
      .preload('locales')
      .select()
      .where((query) => {
        if (payload.roots_only) {
          query.whereNull('parent_id')
        }
      })
      .paginate(payload.page || 1, (payload.count === -1 ? undefined : payload.count || 50))

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

        return item as CategoryModel
      }),
    }
  }
  /**
   * Get category tree
   * @param ctx context
   * @returns categories
   */
  public async tree (ctx: HttpContextContract): Promise<any> {
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
    })

    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const language = headers['x-meshhouse-language'] ?? null

    const categories = await Category
      .query()
      .preload('locales')
      .select()

    const array: CategoryModel[] = []

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

        array.push(item as CategoryModel)
      } else {
        const idx = array.findIndex((val) => val.id === item.parent_id)
        if (idx !== -1) {
          (array[idx].childrens as CategoryModel[]).push(item as CategoryModel)
        }
      }
    })

    return array
  }
  /**
   * Get single category
   * @param ctx context
   * @returns category or error
   */
  public async single (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      params: schema
        .object()
        .members({
          id: schema.number(),
        }),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const category = await Category
      .query()
      .preload('locales')
      .select('*')
      .where({ id: payload.params.id })
      .firstOrFail()

    const item = category.toJSON()

    item.title_en = category.locales.titleEn
    item.title_ru = category.locales.titleRu
    item.description_en = category.locales.descriptionEn
    item.description_ru = category.locales.descriptionRu

    delete item.locales

    return item
  }
  /**
   * Create category
   * @param ctx context
   * @returns category id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateCategoryValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const category = await Category.create({
      slug: payload.slug,
      icon: payload.icon ?? '',
      parentId: payload.parent_id ?? null,
    })

    await category.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en,
      descriptionRu: payload.description_ru,
    })

    return category.id
  }
  /**
   * Update category
   * @param ctx context
   * @returns category id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateCategoryValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const category = await Category.findOrFail(payload.id)

    category.slug = payload.slug
    category.icon = payload.icon ?? ''
    category.parentId = payload.parent_id ?? null

    await category.related('locales').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en || '',
      descriptionRu: payload.description_ru || '',
    })

    return category.id
  }
  /**
   * Delete category
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const category = await Category.findOrFail(payload.id)
    await category.related('locales')
      .query()
      .delete()
      .where('id', payload.id)

    await category.delete()

    return category.$isDeleted
  }
}
