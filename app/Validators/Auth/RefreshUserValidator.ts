import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RefreshUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    refresh_token: schema.string(),
  })

  public messages = {}
}
