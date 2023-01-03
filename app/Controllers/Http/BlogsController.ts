import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import BlogsRepository from 'App/Repositories/BlogsRepository'
import BlogsService from 'App/Services/BlogsService'

import CreateBlogValidator from 'App/Validators/Blog/CreateBlogValidator'
import UpdateBlogValidator from 'App/Validators/Blog/UpdateBlogValidator'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'
import PathSlugValidator from 'App/Validators/Shared/PathSlugValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class BlogsController {
  constructor (
    public BlogsRepository: BlogsRepository,
    public BlogsService: BlogsService
  ) {}

  /**
   * Get posts list
   * @param ctx context
   * @returns posts list
   */
  public async list (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BasicPaginateValidator)

    const posts = await this.BlogsRepository.getList(payload)
    return this.BlogsService.preparePosts(posts, ctx.xLanguage)
  }
  /**
   * Get single post
   * @param ctx context
   * @returns post
   */
  public async single (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathSlugValidator)

    const post = await this.BlogsRepository.getBySlug(payload.params.slug)
    return this.BlogsService.prepareSinglePost(post, ctx.xLanguage)
  }
  /**
   * Create post
   * @param ctx
   * @returns
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateBlogValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.BlogsService.create(payload)
  }
  /**
   * Update post
   * @param ctx context
   * @returns post id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateBlogValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const post = await this.BlogsRepository.getById(payload.id)
    return await this.BlogsService.update(post, payload)
  }
  /**
   * Delete post
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const blog = await this.BlogsRepository.getById(payload.id)
    return await this.BlogsService.delete(blog)
  }
}
