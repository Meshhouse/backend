import Blog from 'App/Models/Blog'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import type { BlogSimple, BlogFull } from '@meshhouse/types'
import CreateBlogValidator from 'App/Validators/Blog/CreateBlogValidator'
import UpdateBlogValidator from 'App/Validators/Blog/UpdateBlogValidator'

export default class BlogsService {
  /**
   * Prepares paginated posts
   * @param posts posts
   * @param language localization
   * @returns
   */
  public preparePosts (posts: ModelPaginatorContract<Blog>, language: string | null) {
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
   * Prepares single blog post
   * @param post post
   * @param language localization
   * @returns post object
   */
  public prepareSinglePost (post: Blog, language: string | null) {
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
   * Creates new post
   * @param payload payload
   * @returns post id
   */
  public async create (payload: CreateBlogValidator['schema']['props']) {
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
   * Updated blog post
   * @param post post
   * @param payload payload
   * @returns post id
   */
  public async update (post: Blog, payload: UpdateBlogValidator['schema']['props']) {
    post.slug = payload.slug
    post.thumbnail = payload.thumbnail || null

    await post.related('locales').updateOrCreate({}, {
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      excerptEn: payload.excerpt_en,
      excerptRu: payload.excerpt_ru,
      contentEn: payload.content_en,
      contentRu: payload.content_ru,
    })

    await post.save()

    return post.id
  }
  /**
   * Deletes blog post
   * @param blog blog
   * @returns is deleted
   */
  public async delete (blog: Blog) {
    await blog.related('locales')
      .query()
      .delete()
      .where('id', blog.id)

    await blog.delete()
    return blog.$isDeleted
  }
}
