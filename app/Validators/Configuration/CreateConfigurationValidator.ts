import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateConfigurationValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    key: schema.string(),
    group: schema.string(),
    title: schema.string(),
    description: schema.string(),
    type: schema.string(),
  })

  public messages = {}
}
