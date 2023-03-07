import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { Limiter } from '@adonisjs/limiter/build/services'
import { DateTime } from 'luxon'
import { HmacSHA512, enc } from 'crypto-js'
import Env from '@ioc:Adonis/Core/Env'
import isbot from 'isbot'

export default class ProtectMiddleware {
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
    const host = ctx.request.host()
    const currentUrl = ctx.request.url()
    const currentMethod = ctx.request.method()

    const timestamp = headers['x-meshhouse-ts']?.toString() || ''
    const currentTime = DateTime.utc().toUnixInteger()

    const limiter = Limiter.use({
      requests: 5,
      duration: '15 mins',
      blockDuration: '30 mins',
    })

    const throttleKey = `hmac_${headers['user-agent']}${host}${currentMethod}${currentUrl}${headers['x-meshhouse-ts']}_${ctx.request.ip()}`

    if (await limiter.isBlocked(throttleKey)) {
      Logger.warn(`Blocked request from ${ctx.request.ip()} ${headers['user-agent']} to ${currentMethod} ${currentUrl}`)
      return ctx.response.tooManyRequests('Too many requests')
    }
    // Creates message which we want to get from request
    const message = `${headers['user-agent']}${host}${currentMethod}${currentUrl}${headers['x-meshhouse-ts']}`
    const expectedKey = HmacSHA512(message, Env.get('API_SECRET_KEY')).toString(enc.Base64url)
    // Is valid signatures
    const isValidAuthKey = headers['x-meshhouse-authentication'] === expectedKey
    // Is timestamp not expired
    const isTimestampNotExpired = currentTime - parseInt(timestamp) <= 60
    // Is bot user agent
    const isBotUA = headers['user-agent']?.toLocaleLowerCase().includes('meshhouse')
      ? false
      : isbot(headers['user-agent'])

    if (!isValidAuthKey || !isTimestampNotExpired || isBotUA) {
      Logger.warn(`Blocked request from ${ctx.request.ip()} ${headers['user-agent']} to ${currentMethod} ${currentUrl}`)
      await limiter.increment(throttleKey)
      return ctx.response.forbidden('Forbidden')
    }

    await limiter.delete(throttleKey)
    await next()
  }
}
