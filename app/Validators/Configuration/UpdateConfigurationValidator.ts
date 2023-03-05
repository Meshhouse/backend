import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateConfigurationValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    id: schema.number(),
    key: schema.string(),
    group: schema.string(),
    title: schema.string(),
    description: schema.string(),
    type: schema.string(),
  })

  public messages = {}
}
