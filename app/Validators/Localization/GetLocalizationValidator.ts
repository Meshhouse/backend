import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetLocalizationValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    language: schema.string(),
  })

  public messages = {}
}
