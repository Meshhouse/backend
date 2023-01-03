import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PathSlugValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    params: schema
      .object()
      .members({
        slug: schema.string(),
      }),
  })

  public messages = {}
}
