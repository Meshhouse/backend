import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidatorConfirm {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(),
    code: schema.string(),
    password: schema.string.optional(),
  })

  public messages = {}
}
