import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Configuration from 'App/Models/Configuration'

export default class ConfigurationsController {
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

    const configs = await Configuration
      .query()
      .select('*')
      .where((query) => {
        if (payload.group) {
          query.whereColumn('group', payload.group)
        }
      })

    return configs
  }

  public async getValue (key: string) {
    const config = await Configuration.findBy('key', key)

    if (config) {
      return config.value
    } else {
      throw new Error('config not found')
    }
  }
}
