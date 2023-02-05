import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(),
    force: schema.boolean.optional(),
  })

  public messages = {}
}
