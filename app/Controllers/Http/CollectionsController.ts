import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Collection from 'App/Models/Collection'

export default class CollectionsController {
  /**
   * Get collections
   * @param ctx context
   * @returns collections
   */
  public async list (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      page: schema.number.optional(),
      count: schema.number.optional(),
    })
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
    })

    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const language = headers['x-meshhouse-language'] ?? null

    const collections = await Collection
      .query()
      .preload('locales')
      .select()
      .paginate(payload.page || 1, (payload.count === -1 ? undefined : payload.count || 50))

    const serialized = collections.serialize({
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

        delete item.locales

        return item
      }),
    }
  }
  /**
   * Create collection
   * @param ctx context
   * @returns collection id
   */
  public async create (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      slug: schema.string(),
      title_en: schema.string(),
      title_ru: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const collection = await Collection.create({
      slug: payload.slug,
    })

    await collection.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
    })

    return collection.id
  }
  /**
   * Update collection
   * @param ctx context
   * @returns collection id
   */
  public async update (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
      slug: schema.string(),
      title_en: schema.string(),
      title_ru: schema.string(),
    })
    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const collection = await Collection.findOrFail(payload.id)

    collection.slug = payload.slug

    await collection.related('locales').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
    })

    return collection.id
  }
  /**
   * Delete collection
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const collection = await Collection.findOrFail(payload.id)
    await collection.related('locales')
      .query()
      .delete()
      .where('id', payload.id)

    await collection.delete()

    return collection.$isDeleted
  }
}
