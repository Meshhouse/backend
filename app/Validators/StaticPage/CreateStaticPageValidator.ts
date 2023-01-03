import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateStaticPageValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    slug: schema.string(),
    title_en: schema.string(),
    title_ru: schema.string(),
    content_en: schema.string(),
    content_ru: schema.string(),
  })

  public messages = {}
}
