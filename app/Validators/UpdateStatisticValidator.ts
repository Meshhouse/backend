import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateStatisticValidator {
  constructor (protected ctx: HttpContextContract) {}
  public schema = schema.create({
    uid: schema.string(),
    model_id: schema.number.optional(),
    file_id: schema.number.optional(),
  })
  public messages: CustomMessages = {}
}
