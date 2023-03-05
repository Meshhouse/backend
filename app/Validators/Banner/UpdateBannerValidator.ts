import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateBannerValidator {
  constructor (protected ctx: HttpContextContract) { }

  public schema = schema.create({
    id: schema.number(),
    title: schema.string(),
    type: schema.enum<('static' | 'interactive')[]>(['static', 'interactive']),
    source: schema.string(),
    href: schema.string.optional(),
    page: schema.string.optional(),
    category: schema.number.optional(),
    status: schema.boolean(),
  })

  public messages = {}
}
