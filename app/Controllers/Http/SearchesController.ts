import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import { inject } from '@adonisjs/fold'
import ModelsRepository from 'App/Repositories/ModelsRepository'
import ModelsService from 'App/Services/ModelsService'

@inject()
export default class SearchesController {
  constructor (
    public ModelsRepository: ModelsRepository,
    public ModelsService: ModelsService
  ) {}

  public async autocomplete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      query: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    let escapedQuery = string.escapeHTML(payload.query.toLowerCase()).replace(/[^a-zA-Z0-9_ ]+/gmu, '')

    const models = await this.ModelsRepository.getForAutocomplete(ctx.xMatureContent, escapedQuery)

    return {
      models: this.ModelsService.prepareModelsForSearch(models, ctx.xLanguage),
    }
  }
}
