import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Model from 'App/Models/Model'
import { ModelSimple } from 'Contracts/Model'

export default class SearchesController {
  public async autocomplete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      query: schema.string(),
    })

    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
      'x-meshhouse-mature-content': schema.boolean.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const language = headers['x-meshhouse-language'] ?? null
    const matureContent = headers['x-meshhouse-mature-content'] ?? null

    let escapedQuery = string.escapeHTML(payload.query.toLowerCase()).replace(/[^a-zA-Z0-9_ ]+/gmu, '')

    const modelsResponse = await Model
      .query()
      .preload('category')
      .preload('files')
      .preload('locales', (localesQuery) => {
        localesQuery.select('rowid', '*')
      })
      .select('id', 'slug', 'mature_content', 'thumbnail', 'created_at', 'updated_at')
      .where((query) => {
        if (matureContent === false || matureContent === null) {
          query.where('mature_content', false)
        }
      })
      .whereHas('locales', (localesQuery) => {
        localesQuery
          .where('models_localizations', 'match', escapedQuery)
      })
      .limit(5)

    const models = modelsResponse.map((model) => {
      const item = model.toJSON()
      if (!language) {
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru
      } else {
        item.title = item.locales[`title_${language}`]
      }

      item.category = item.category[0].slug

      item.available_formats = []

      item.files.map((file) => {
        if (!item.available_formats.includes(file.program)) {
          item.available_formats.push(file.program)
        }
      })

      delete item.locales
      delete item.files
      return item as ModelSimple
    })

    return {
      models,
    }
  }
}
