/* eslint-disable max-len */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { inject } from '@adonisjs/fold'
import ConfigurationsRepository from 'App/Repositories/ConfigurationsRepository'
import ConfigurationService from 'App/Services/ConfigurationService'
import CreateConfigurationValidator from 'App/Validators/Configuration/CreateConfigurationValidator'
import UpdateConfigurationValidator from 'App/Validators/Configuration/UpdateConfigurationValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class ConfigurationsController {
  constructor (
    public ConfigurationsRepository: ConfigurationsRepository,
    public ConfigurationService: ConfigurationService,
  ) { }

  /**
   * Gets all settings
   * @param ctx context
   * @returns settings
   */
  public async list (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      group: schema.string.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    const configs = await this.ConfigurationsRepository.list(payload.group)

    return this.ConfigurationService.prepare(configs)
  }
  /**
   * Gets all settings groups
   * @param ctx context
   * @returns settings groups
   */
  public async listGroups (ctx: HttpContextContract) {
    await ctx.bouncer.authorize('viewAdmin')
    return await this.ConfigurationsRepository.listGroups()
  }
  /**
   * Creates new config
   * @param ctx context
   * @returns is created
   */
  public async create (ctx: HttpContextContract) {
    const payload: CreateConfigurationValidator['schema']['props'] & { value?: unknown } = await ctx.request.validate(CreateConfigurationValidator)
    payload.value = ctx.request.body().value
    await ctx.bouncer.authorize('viewAdmin')

    return await this.ConfigurationService.create(payload)
  }
  /**
   * Updates config
   * @param ctx context
   * @returns is updated
   */
  public async update (ctx: HttpContextContract) {
    const payload: UpdateConfigurationValidator['schema']['props'] & { value?: unknown } = await ctx.request.validate(UpdateConfigurationValidator)
    payload.value = ctx.request.body().value
    await ctx.bouncer.authorize('viewAdmin')

    const config = await this.ConfigurationsRepository.get(payload.id)

    return await this.ConfigurationService.update(config, payload)
  }
  /**
   * Deletes config
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const config = await this.ConfigurationsRepository.get(payload.id)

    return await this.ConfigurationService.delete(config)
  }
}
