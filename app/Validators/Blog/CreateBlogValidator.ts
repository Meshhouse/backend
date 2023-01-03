import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBlogValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    slug: schema.string(),
    thumbnail: schema.string.optional(),
    title_en: schema.string(),
    title_ru: schema.string(),
    excerpt_en: schema.string(),
    excerpt_ru: schema.string(),
    content_en: schema.string(),
    content_ru: schema.string(),
  })

  public messages = {}
}
