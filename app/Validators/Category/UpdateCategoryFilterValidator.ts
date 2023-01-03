import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateCategoryFilterValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
    categories: schema.array().members(schema.number()),
    order: schema.number(),
    key: schema.string(),
    querystring_alias: schema.string(),
    value_delimeter: schema.string.optional(),
    values: schema.array().members(schema.object().anyMembers()),
    title_en: schema.string(),
    title_ru: schema.string(),
    description_en: schema.string.optional(),
    description_ru: schema.string.optional(),
    unit_en: schema.string.optional(),
    unit_ru: schema.string.optional(),
    multiple_values: schema.boolean.optional(),
    visible: schema.boolean(),
  })

  public messages = {}
}
