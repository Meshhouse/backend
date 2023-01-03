import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'
import { inject } from '@adonisjs/fold'
import Env from '@ioc:Adonis/Core/Env'
import ModelsRepository from 'App/Repositories/ModelsRepository'
import ModelsService from 'App/Services/ModelsService'
import CreateModelValidator from 'App/Validators/Model/CreateModelValidator'
import UpdateModelValidator from 'App/Validators/Model/UpdateModelValidator'
import ListModelValidator from 'App/Validators/Model/ListModelValidator'
import ListFavoritesModelValidator from 'App/Validators/Model/ListFavoritesModelValidator'
import PathSlugValidator from 'App/Validators/Shared/PathSlugValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'
import BodyIdsValidator from 'App/Validators/Shared/BodyIdsValidator'
import ExportValidator from 'App/Validators/Export/ExportValidator'

@inject()
export default class ModelsController {
  constructor (
    public ModelsRepository: ModelsRepository,
    public ModelsService: ModelsService
  ) {}
  /**
   * Get models
   * @param ctx context
   * @returns models or error
   */
  public async list (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ListModelValidator)
    const escapedQuery = string
      .escapeHTML(String(payload.query).toLowerCase())
      .replace(/[^a-zA-Z0-9_ ]+/gmu, '')

    const models = await this.ModelsRepository.getWithFilters(
      payload,
      ctx.xMatureContent,
      escapedQuery,
      ctx.xLanguage
    )
    return this.ModelsService.prepareModels(models, ctx.xLanguage)
  }
  /**
   * Get favorite models
   * @param ctx context
   * @returns models
   */
  public async listFavorites (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ListFavoritesModelValidator)
    const models = await this.ModelsRepository.getForFavorites(payload.ids)

    return this.ModelsService.prepareModelsFavorite(models, ctx.xLanguage)
  }
  /**
   * Get models
   * @param ctx context
   * @returns models or error
   */
  public async listAdminPanel (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ListModelValidator)
    await ctx.bouncer.allows('viewAdmin')

    const models = await this.ModelsRepository.getList(payload)
    return this.ModelsService.prepareModelsForAdmin(models)
  }
  /**
   * Get model by slug
   * @param ctx context
   * @returns model or error
   */
  public async single (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathSlugValidator)

    const model = await this.ModelsRepository.getSingle(payload.params.slug)
    return await this.ModelsService.prepareSingleModel(model, ctx)
  }
  /**
   * Create model
   * @param ctx context
   * @returns model id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateModelValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.ModelsService.createModel(payload)
  }
  /**
   * Update model
   * @param ctx context
   * @returns model id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateModelValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const model = await this.ModelsRepository.getById(payload.id)
    return await this.ModelsService.updateModel(model, payload)
  }
  /**
   * Delete model
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const model = await this.ModelsRepository.getById(payload.id)
    return await this.ModelsService.deleteModel(model)
  }
  /**
   * Get models list by collection
   * @param ctx context
   * @returns model collections
   */
  public async listCollection (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdsValidator)

    const models = await this.ModelsRepository.getByCollection(payload.ids, ctx.xMatureContent)
    return this.ModelsService.prepareModelCollections(models, ctx.xLanguage)
  }
  /**
   * Get models count
   * @returns count
   */
  public async statistics () {
    const stats = await this.ModelsRepository.getModelStatistics()

    return {
      stats: stats[0],
    }
  }

  public async crayaExport (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ExportValidator)

    if (payload.user !== Env.get('CRAYA_EXPORT_USER') || payload.password !== Env.get('CRAYA_EXPORT_PASSWORD')) {
      return ctx.response.unauthorized('Invalid credentials')
    }

    const rawModels = await this.ModelsRepository.getForExport()

    return this.ModelsService.prepareForExport(rawModels)
  }
}
