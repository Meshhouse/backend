import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ModelStatisticValidator {
  constructor (protected ctx: HttpContextContract) {}
  public schema = schema.create({
    ids: schema.array().members(schema.number()),
  })
  public messages: CustomMessages = {}
}
