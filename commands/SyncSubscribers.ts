import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class SyncSubscribers extends BaseCommand {
  public static commandName = 'sync:subscribers'
  public static description = 'Perform syncronization Patreon and Boosty subscriptions'
  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run () {
    const { default: BoostyService } = await import('App/Services/BoostyService')

    const boosty = new BoostyService()
    await boosty.syncSubscriptions()
  }
}
