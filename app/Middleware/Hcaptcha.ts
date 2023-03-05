import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import HcaptchaValidator from '@ioc:Hcaptcha'

/**
 * Please register this middleware inside `start/kernel.ts` file under the list
 * of named middleware
 */

export default class Hcaptcha {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>): Promise<void> {
    const getHcaptchaTokenFromRequest = ctx.request.header('h-captcha-response') || ''

    try {
      ctx.hcaptcha = await HcaptchaValidator.verifyToken(getHcaptchaTokenFromRequest)
    } catch (error) {
      throw new Exception('invalid-input-response', 400, 'H_CAPTCHA')
    }

    await next()
  }
}
