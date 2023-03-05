/* eslint-disable max-len */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'
import AccessoryModelConfigValidator from 'App/Validators/AccessoryModelConfig/AccessoryModelConfigValidator'
import AccessoryModelConfigsRepository from 'App/Repositories/AccessoryModelConfigsRepository'
import AccessoryModelConfigsService from 'App/Services/AccessoryModelConfigsService'
import CategoriesRepository from 'App/Repositories/CategoriesRepository'
import CategoriesService from 'App/Services/CategoriesService'
import ModelsRepository from 'App/Repositories/ModelsRepository'
import ModelsService from 'App/Services/ModelsService'
import PathSlugValidator from 'App/Validators/Shared/PathSlugValidator'

@inject()
export default class AccessoryModelConfigsController {
  constructor (
    public AccessoryModelConfigsRepository: AccessoryModelConfigsRepository,
    public AccessoryModelConfigsService: AccessoryModelConfigsService,
    public CategoriesRepository: CategoriesRepository,
    public CategoriesService: CategoriesService,
    public ModelsRepository: ModelsRepository,
    public ModelsService: ModelsService
  ) { }
  /**
   * Gets model config
   * @param ctx context
   * @returns model config
   */
  public async get (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.AccessoryModelConfigsRepository.get(payload.id)
  }
  /**
   * Creates new model config
   * @param ctx context
   * @returns is created
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(AccessoryModelConfigValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.AccessoryModelConfigsService.create(payload)
  }
  /**
   * Updates model config
   * @param ctx context
   * @returns is updated
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(AccessoryModelConfigValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const config = await this.AccessoryModelConfigsRepository.get(payload.id)

    return await this.AccessoryModelConfigsService.update(config, payload)
  }
  /**
   * Gets model accessories
   * @param ctx context
   * @returns model accessories
   */
  public async listModelAccessories (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathSlugValidator)

    const { model, conditions } = await this.AccessoryModelConfigsRepository.calculateModelConditions(payload.params.slug)

    const models: Record<number, unknown[]> = {}

    const categoriesIds = Array.from(new Set(conditions.map((condition) => condition.category_id)))
    const categoriesResponse = await this.CategoriesRepository.getByIds(categoriesIds)

    for (const condition of conditions) {
      const response = await this.ModelsRepository.getAccessories(model, condition.category_id, condition.filters)

      models[condition.category_id] = this.ModelsService.prepareModelsFavorite(response, ctx.xLanguage)
    }

    return {
      categories: categoriesResponse
        .filter((category) => models[category.id].length > 0)
        .map((category) => this.CategoriesService.prepareForAccessories(category, ctx.xLanguage)),
      models,
    }
  }
}
