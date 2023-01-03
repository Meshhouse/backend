import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateSubscriptionValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
    service: schema.enum<('patreon' | 'boosty')[]>(['patreon', 'boosty']),
    service_id: schema.number(),
    name: schema.string(),
    description: schema.string.optional(),
    price: schema.number(),
    currency: schema.string(),
    features: schema.object().members({
      nickname: schema.boolean(),
      source_files: schema.boolean(),
      sponsor_image: schema.boolean(),
      no_courtesy: schema.boolean(),
      no_courtesy_mature_content: schema.boolean(),
    }),
  })

  public messages = {}
}
