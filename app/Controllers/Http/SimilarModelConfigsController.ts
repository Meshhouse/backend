import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'
import SimilarModelConfigValidator from 'App/Validators/SimilarModelConfig/SimilarModelConfigValidator'
import SimilarModelConfigRepository from 'App/Repositories/SimilarModelConfigRepository'
import SimilarModelConfigsService from 'App/Services/SimilarModelConfigsService'
import ModelsRepository from 'App/Repositories/ModelsRepository'
import ModelsService from 'App/Services/ModelsService'
import PathSlugValidator from 'App/Validators/Shared/PathSlugValidator'

@inject()
export default class SimilarModelConfigsController {
  constructor (
    public SimilarModelConfigRepository: SimilarModelConfigRepository,
    public SimilarModelConfigsService: SimilarModelConfigsService,
    public ModelsRepository: ModelsRepository,
    public ModelsService: ModelsService
  ) {}
  /**
   * Gets model config
   * @param ctx context
   * @returns model config
   */
  public async get (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.SimilarModelConfigRepository.get(payload.id)
  }
  /**
   * Creates new model config
   * @param ctx context
   * @returns is created
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(SimilarModelConfigValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.SimilarModelConfigsService.create(payload)
  }
  /**
   * Updates model config
   * @param ctx context
   * @returns is updated
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(SimilarModelConfigValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const config = await this.SimilarModelConfigRepository.get(payload.id)

    return await this.SimilarModelConfigsService.update(config, payload)
  }
  /**
   * Gets similar models
   * @param ctx context
   * @returns similar models
   */
  public async listSimilarModels (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathSlugValidator)

    const { model, conditions } = await this.SimilarModelConfigRepository.calculateModelConditions(payload.params.slug)
    const models = await this.ModelsRepository.getSimilar(model, conditions)

    return this.ModelsService.prepareModelsFavorite(models, ctx.xLanguage)
  }
}
