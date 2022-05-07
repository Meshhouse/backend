import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { HmacSHA512, enc } from 'crypto-js'
import Env from '@ioc:Adonis/Core/Env'
// import isbot from 'isbot'

export default class ProtectMiddleware {
  protected allowedOrigins = ['https://meshhouse.art', 'http://localhost:8080', 'http://localhost:3000', 'https://cp.meshhouse.art']
  /**
   * Basic private API protection
   * @param ctx
   * @param next
   * @returns
   */
  public async handle (
    ctx: HttpContextContract,
    next: () => Promise<void>
  ) {
    const headers = ctx.request.headers()
    const currentUrl = ctx.request.url()
    const currentMethod = ctx.request.method()

    let currentTime = Math.round(DateTime.utc().toSeconds())
    currentTime = Math.round(currentTime / 10) * 10

    const message = `${headers['user-agent']}${currentUrl}${currentMethod}${currentTime}`
    const expectedKey = HmacSHA512(message, Env.get('API_SECRET_KEY')).toString(enc.Base64url)

    const isValidAuthKey = headers['x-meshhouse-authentication'] === expectedKey
    // const isValidOrigin = headers.origin && this.allowedOrigins.includes(headers.origin)
    // const isBotUA = !headers['user-agent'] || isbot(headers['user-agent'])

    if (!isValidAuthKey) {
      return ctx.response.forbidden('Forbidden')
    }

    await next()
  }
}
