import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SyncsController {
  public async syncSupporters (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    return true
  }

  public async syncPatrons (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    return true
  }
}
