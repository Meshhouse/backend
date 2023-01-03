import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BodyIdsValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ids: schema.array().members(schema.number()),
  })

  public messages = {}
}
