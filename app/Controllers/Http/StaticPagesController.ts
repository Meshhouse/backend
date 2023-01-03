import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/fold'
import StaticPagesRepository from 'App/Repositories/StaticPagesRepository'
import StaticPagesService from 'App/Services/StaticPagesService'
import CreateStaticPageValidator from 'App/Validators/StaticPage/CreateStaticPageValidator'
import UpdateStaticPageValidator from 'App/Validators/StaticPage/UpdateStaticPageValidator'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'
import PathSlugValidator from 'App/Validators/Shared/PathSlugValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class StaticPagesController {
  constructor (
    public StaticPagesRepository: StaticPagesRepository,
    public StaticPagesService: StaticPagesService
  ) {}
  /**
   * Handles github application page
   * @returns
   */
  public async applicationPC () {
    if (!Env.get('GITHUB_TOKEN')) {
      throw new Error('token not set')
    }

    const data = await this.StaticPagesRepository.getGithubPage()
    return this.StaticPagesService.prepareGithubData(data)
  }
  /**
   * Gets static pages list
   * @param ctx context
   * @returns static pages
   */
  public async list (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')
    const payload = await ctx.request.validate(BasicPaginateValidator)

    const pages = await this.StaticPagesRepository.list(payload)
    return this.StaticPagesService.prepareList(pages, ctx.xLanguage)
  }
  /**
   * Gets single static page
   * @param ctx context
   * @returns static page
   */
  public async get (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathSlugValidator)

    const page = await this.StaticPagesRepository.getBySlug(payload.params.slug)
    return this.StaticPagesService.prepareSingle(page, ctx.xLanguage)
  }
  /**
   * Creates static page
   * @param ctx context
   * @returns page id
   */
  public async create (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')
    const payload = await ctx.request.validate(CreateStaticPageValidator)

    return await this.StaticPagesService.createPage(payload)
  }
  /**
   * Updates static page
   * @param ctx context
   * @returns page id
   */
  public async update (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')
    const payload = await ctx.request.validate(UpdateStaticPageValidator)

    const page = await this.StaticPagesRepository.getById(payload.id)
    return await this.StaticPagesService.updatePage(page, payload)
  }
  /**
   * Deletes static page
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')
    const payload = await ctx.request.validate(BodyIdValidator)

    const page = await this.StaticPagesRepository.getById(payload.id)
    return await this.StaticPagesService.deletePage(page)
  }
}
