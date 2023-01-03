import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FindBlockValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    params: schema
      .object()
      .members({
        type: schema.string(),
      }),
  })

  public messages: CustomMessages = {}
}
