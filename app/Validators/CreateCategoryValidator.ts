import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCategoryValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    slug: schema.string(),
    icon: schema.string.optional(),
    parent_id: schema.number.optional(),
    title_en: schema.string(),
    title_ru: schema.string(),
    description_en: schema.string.optional(),
    description_ru: schema.string.optional(),
  })

  public messages = {}
}
