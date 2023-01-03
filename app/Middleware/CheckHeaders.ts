import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'

export default class CheckHeadersMiddleware {
  public async handle (
    ctx: HttpContextContract,
    next: () => Promise<void>
  ) {
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
      'x-meshhouse-mature-content': schema.boolean.optional(),
    })

    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    ctx.xLanguage = headers['x-meshhouse-language'] ?? null
    ctx.xMatureContent = headers['x-meshhouse-mature-content'] ?? null
    ctx.xAdminPanel = await ctx.bouncer.allows('viewAdmin')

    await next()
  }
}
