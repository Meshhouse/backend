import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(),
    password: schema.string.optional(),
    name: schema.string(),
    role: schema.string(),
  })

  public messages = {}
}
