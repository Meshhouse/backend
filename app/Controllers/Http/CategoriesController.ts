import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import CategoriesRepository from 'App/Repositories/CategoriesRepository'
import CategoriesService from 'App/Services/CategoriesService'
import Block from 'App/Models/Block'
import CreateCategoryValidator from 'App/Validators/Category/CreateCategoryValidator'
import UpdateCategoryValidator from 'App/Validators/Category/UpdateCategoryValidator'
import ListCategoryValidator from 'App/Validators/Category/ListCategoryValidator'
import PathIdValidator from 'App/Validators/Shared/PathIdValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class CategoriesController {
  constructor (
    public CategoriesRepository: CategoriesRepository,
    public CategoriesService: CategoriesService
  ) {}

  /**
   * Get categories
   * @param ctx context
   * @returns categories
   */
  public async list (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ListCategoryValidator)

    const categories = await this.CategoriesRepository.getPaginated(payload)
    return this.CategoriesService.prepareList(categories, ctx.xLanguage)
  }
  /**
   * Get category tree
   * @param ctx context
   * @returns categories
   */
  public async tree (ctx: HttpContextContract) {
    const categories = await this.CategoriesRepository.get()
    return this.CategoriesService.prepareTree(categories, ctx.xLanguage)
  }
  /**
   * Get single category
   * @param ctx context
   * @returns category or error
   */
  public async single (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathIdValidator)

    const category = await this.CategoriesRepository.getById(payload.params.id)
    return this.CategoriesService.prepareSingle(category)
  }
  /**
   * Create category
   * @param ctx context
   * @returns category id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateCategoryValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.CategoriesService.create(payload)
  }
  /**
   * Update category
   * @param ctx context
   * @returns category id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateCategoryValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const category = await this.CategoriesRepository.getById(payload.id)
    return await this.CategoriesService.update(category, payload)
  }
  /**
   * Delete category
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const category = await this.CategoriesRepository.getById(payload.id)
    return await this.CategoriesService.delete(category)
  }
  /**
   * Get list of category filters
   * @param ctx context
   * @returns category filters
   */
  public async listFilters (ctx: HttpContextContract) {
    const payload = ctx.request.params()

    const block = await Block
      .query()
      .select('*')
      .where({ type: 'category_filters' })
      .firstOrFail()

    return await this.CategoriesService.getFilters(block, payload.id, ctx.xLanguage)
  }
}
