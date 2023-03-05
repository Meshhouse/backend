import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import ConfigurationsRepository from 'App/Repositories/ConfigurationsRepository'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
@inject()
export default class SilentAuthMiddleware {
  constructor (
    private ConfigurationsRepository: ConfigurationsRepository
  ) {}

  /**
   * Handle request
   */
  public async handle ({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    const originURL = request.url(false)
    const maintenanceMode = (await this.ConfigurationsRepository.getByKey('MAINTENANCE_MODE'))?.value
    const excludedURLS = [
      'login',
      'profile',
      'refresh',
      'localization',
    ]
    const isNotExcludedURL = !excludedURLS.some(v => originURL.includes(v))
    const checkMaintenanceMode = maintenanceMode && isNotExcludedURL

    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */
    try {
      await auth.check()
      if (auth?.user?.role !== 'admin' && checkMaintenanceMode) {
        return response.serviceUnavailable('')
      }
    } catch (error) {
      if (checkMaintenanceMode) {
        return response.serviceUnavailable('')
      }
    }
    await next()
  }
}
