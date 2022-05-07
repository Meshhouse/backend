import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Blog from 'App/Models/Blog'

import CreateBlogValidator from 'App/Validators/CreateBlogValidator'
import UpdateBlogValidator from 'App/Validators/UpdateBlogValidator'
import { BlogFull, BlogSimple } from 'Contracts/blog'

export default class BlogsController {
  /**
   * Get posts list
   * @param ctx context
   * @returns posts list
   */
  public async list (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      page: schema.number.optional(),
      count: schema.number.optional(),
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

    const posts = await Blog
      .query()
      .preload('locales')
      .select('id', 'slug', 'thumbnail', 'created_at', 'updated_at')
      .paginate(payload.page || 1, payload.count || 10)

    const serialized = posts.serialize({
      relations: {
        locales: {
          fields: ['title_en', 'title_ru', 'excerpt_en', 'excerpt_ru'],
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
          item.excerpt_en = item.locales.excerpt_en
          item.excerpt_ru = item.locales.excerpt_ru
        } else {
          item.title = item.locales[`title_${language}`]
          item.excerpt = item.locales[`excerpt_${language}`]
        }

        delete item.locales

        return item as BlogSimple
      }),
    }
  }
  /**
   * Get single post
   * @param ctx context
   * @returns post
   */
  public async single (ctx: HttpContextContract) {
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

    const post = await Blog
      .query()
      .preload('locales')
      .select('*')
      .where({ slug: payload.params.slug })
      .firstOrFail()

    const item = post.toJSON()

    if (!language) {
      item.title_en = item.locales.title_en
      item.title_ru = item.locales.title_ru
      item.excerpt_en = item.locales.excerpt_en
      item.excerpt_ru = item.locales.excerpt_ru
      item.content_en = item.locales.content_en
      item.content_ru = item.locales.content_ru
    } else {
      item.title = item.locales[`title_${language}`]
      item.excerpt = item.locales[`excerpt_${language}`]
      item.content = item.locales[`content_${language}`]
    }

    delete item.locales

    return item as BlogFull
  }
  /**
   * Create post
   * @param ctx
   * @returns
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateBlogValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const blog = await Blog.create({
      slug: payload.slug,
      thumbnail: payload.thumbnail || null,
    })

    await blog.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      excerptEn: payload.excerpt_en,
      excerptRu: payload.excerpt_ru,
      contentEn: payload.content_en,
      contentRu: payload.content_ru,
    })

    return blog.id
  }
  /**
   * Update post
   * @param ctx context
   * @returns post id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateBlogValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const blog = await Blog.findOrFail(payload.id)

    blog.slug = payload.slug
    blog.thumbnail = payload.thumbnail || null

    await blog.related('locales').updateOrCreate({}, {
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      excerptEn: payload.excerpt_en,
      excerptRu: payload.excerpt_ru,
      contentEn: payload.content_en,
      contentRu: payload.content_ru,
    })

    await blog.save()

    return blog.id
  }
  /**
   * Delete post
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const blog = await Blog.findOrFail(payload.id)
    await blog.related('locales')
      .query()
      .delete()
      .where('id', payload.id)

    await blog.delete()

    return blog.$isDeleted
  }
}
