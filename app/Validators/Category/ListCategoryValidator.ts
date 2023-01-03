import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ListCategoryValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    page: schema.number.optional(),
    count: schema.number.optional(),
    roots_only: schema.boolean.optional(),
  })

  public messages = {}
}
