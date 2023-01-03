import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateLocalizationValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    items: schema.array().members(schema.object().members({
      key: schema.string(),
      en: schema.string(),
      ru: schema.string(),
    })),
  })

  public messages = {}
}
