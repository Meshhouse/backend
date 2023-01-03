import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import CategoryFiltersRepository from 'App/Repositories/CategoryFiltersRepository'
import CategoryFiltersService from 'App/Services/CategoryFiltersService'
import CreateCategoryFilterValidator from 'App/Validators/Category/CreateCategoryFilterValidator'
import UpdateCategoryFilterValidator from 'App/Validators/Category/UpdateCategoryFilterValidator'
import BodyIdAltValidator from 'App/Validators/Shared/BodyIdAltValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class CategoryFiltersController {
  constructor (
    public CategoryFiltersRepository: CategoryFiltersRepository,
    public CategoryFiltersService: CategoryFiltersService
  ) {}

  /**
   * Gets list of category filters
   * @param ctx context
   * @returns category filters
   */
  public async list (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdAltValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const filters = await this.CategoryFiltersRepository.getByCategory(payload.id)
    return this.CategoryFiltersService.prepareFilters(filters, ctx.xLanguage)
  }
  /**
   * Create category filter
   * @param ctx context
   * @returns is created
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateCategoryFilterValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.CategoryFiltersService.create(payload)
  }
  /**
   * Update category filter
   * @param ctx context
   * @returns is updated
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateCategoryFilterValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const filter = await this.CategoryFiltersRepository.getById(payload.id)
    return await this.CategoryFiltersService.update(filter, payload)
  }
  /**
   * Delete category filter
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const filter = await this.CategoryFiltersRepository.getById(payload.id)
    return await this.CategoryFiltersService.delete(filter)
  }
}
