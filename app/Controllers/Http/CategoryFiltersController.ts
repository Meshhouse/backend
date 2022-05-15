import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import CategoryFilter from 'App/Models/CategoryFilter'
import CreateCategoryFilterValidator from 'App/Validators/CreateCategoryFilterValidator'
import UpdateCategoryFilterValidator from 'App/Validators/UpdateCategoryFilterValidator'

export default class CategoryFiltersController {
  /**
   * Gets list of category filters
   * @param ctx context
   * @returns category filters
   */
  public async list (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.string(),
    })
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    await ctx.bouncer.authorize('viewAdmin')

    const language = headers['x-meshhouse-language'] ?? null

    const filters = await CategoryFilter
      .query()
      .preload('locales')
      .select('*')
      .where('category', payload.id)

    return filters.map((filter) => {
      const item = filter.toJSON()

      if (!language) {
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru
      } else {
        item.title = item.locales[`title_${language}`]
      }

      delete item.locales

      return item
    })
  }
  /**
   * Create category filter
   * @param ctx context
   * @returns is created
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateCategoryFilterValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const filter = await CategoryFilter.create({
      category: payload.category,
      order: payload.order,
      key: payload.key,
      type: payload.type,
      querystringAlias: payload.querystring_alias,
      valueDelimeter: payload.value_delimeter || null,
      values: payload.values,
    })

    await filter.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
    })

    return filter.id
  }
  /**
   * Update category filter
   * @param ctx context
   * @returns is updated
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateCategoryFilterValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const filter = await CategoryFilter.findOrFail(payload.id)

    filter.order = payload.order
    filter.key = payload.key
    filter.querystringAlias = payload.querystring_alias
    filter.valueDelimeter = payload.value_delimeter || null
    filter.values = payload.values

    await filter.related('locales').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
    })

    return filter.id
  }
  /**
   * Delete category filter
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const filter = await CategoryFilter.findOrFail(payload.id)
    await filter.related('locales')
      .query()
      .delete()
      .where('id', payload.id)

    await filter.delete()

    return filter.$isDeleted
  }
}
