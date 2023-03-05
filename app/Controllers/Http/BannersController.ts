import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import Banner from 'App/Models/Banner'
import BannersRepository from 'App/Repositories/BannersRepository'
import CategoriesRepository from 'App/Repositories/CategoriesRepository'
import BannersService from 'App/Services/BannersService'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'
import CreateBannerValidator from 'App/Validators/Banner/CreateBannerValidator'
import UpdateBannerValidator from 'App/Validators/Banner/UpdateBannerValidator'
import BodySlugValidator from 'App/Validators/Shared/BodySlugValidator'

@inject()
export default class BannersController {
  constructor (
    public BannersRepository: BannersRepository,
    public BannersService: BannersService,
    public CategoriesRepository: CategoriesRepository
  ) {}
  /**
   * Gets list of banners
   * @param ctx context
   * @returns banners list
   */
  public async list (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BasicPaginateValidator)
    await ctx.bouncer.allows('viewAdmin')

    return await this.BannersRepository.list(payload)
  }
  /**
   * Creates new banner
   * @param ctx context
   * @returns is created
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateBannerValidator)
    await ctx.bouncer.allows('viewAdmin')

    return await this.BannersService.create(payload)
  }
  /**
   * Updates banner
   * @param ctx context
   * @returns is updated
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateBannerValidator)
    await ctx.bouncer.allows('viewAdmin')

    const banner = await this.BannersRepository.get(payload.id)
    return await this.BannersService.update(banner, payload)
  }
  /**
   * Deletes banner
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.allows('viewAdmin')

    const banner = await this.BannersRepository.get(payload.id)
    return await this.BannersService.delete(banner)
  }
  /**
   * Gets banner for page
   * @param ctx context
   * @returns banner or error
   */
  public async getForPage (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodySlugValidator)

    const splittedPath = payload.slug.split('/')
    let banner: Banner | undefined
    // If is model page
    if (splittedPath.length === 3) {
      banner = await this.BannersRepository.getByParams('model')
    } else {
      // If is category page
      let categoryId: number | undefined
      if (splittedPath.length === 2) {
        const slug = splittedPath[1]

        const category = await this.CategoriesRepository.getBySlug(slug)
        categoryId = category.id
      }

      banner = await this.BannersRepository.getByParams('category', categoryId)
    }

    if (banner) {
      return this.BannersService.prepare(banner)
    } else {
      return ctx.response.notFound('')
    }
  }
}
