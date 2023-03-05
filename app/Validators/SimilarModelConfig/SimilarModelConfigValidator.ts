import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SimilarModelConfigValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    id: schema.number(),
    pre_conditions: schema.array().anyMembers(),
    post_conditions: schema.array().anyMembers(),
  })

  public messages = {}
}
