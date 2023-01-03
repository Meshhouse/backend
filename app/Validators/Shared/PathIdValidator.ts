import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PathIdValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    params: schema
      .object()
      .members({
        id: schema.number(),
      }),
  })

  public messages = {}
}
