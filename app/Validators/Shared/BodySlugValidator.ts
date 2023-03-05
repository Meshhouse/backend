import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BodySlugValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    slug: schema.string(),
  })

  public messages = {}
}
