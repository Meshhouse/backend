import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteTokenValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
  })

  public messages = {}
}
