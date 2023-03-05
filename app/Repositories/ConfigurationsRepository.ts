import { inject } from '@adonisjs/fold'
import Configuration from 'App/Models/Configuration'
import Redis from '@ioc:Adonis/Addons/Redis'
import ConfigurationService from 'App/Services/ConfigurationService'

@inject()
export default class ConfigurationsRepository {
  private REDIS_CONFIG_PREFIX = 'MSH_SETTING_'
  private REDIS_CONFIG_EXPIRE = 60 * 5
  private REDIS_CONFIG_EXCLUDE_CACHE = [
    'MAINTENANCE_MODE',
  ]

  constructor (
    private ConfigurationService: ConfigurationService
  ) {}
  /**
   * Gets all settings
   * @param group group name
   * @returns settings
   */
  public async list (group?: string) {
    return Configuration
      .query()
      .select('*')
      .where((query) => {
        if (group) {
          query.whereColumn('group', group)
        }
      })
  }
  /**
   * Gets config groups
   * @returns config groups
   */
  public async listGroups () {
    return Configuration
      .query()
      .select('group')
      .distinct('group')
  }
  /**
   * Get setting by key
   * @param key setting key
   * @returns setting
   */
  public async getByKey (key: string): Promise<Configuration | null> {
    const cached = await Redis.get(`${this.REDIS_CONFIG_PREFIX}${key}`)

    if (cached) {
      return this.ConfigurationService.prepareSingle(JSON.parse(cached)) as Configuration
    } else {
      try {
        const setting = await Configuration.findByOrFail('key', key)
        await Redis.set(`${this.REDIS_CONFIG_PREFIX}${key}`, JSON.stringify(setting.toJSON()))
        await Redis.expire(`${this.REDIS_CONFIG_PREFIX}${key}`, !this.REDIS_CONFIG_EXCLUDE_CACHE.includes(key) ? this.REDIS_CONFIG_EXPIRE : 1)

        return this.ConfigurationService.prepareSingle(setting) as Configuration
      } catch (error) {
        return null
      }
    }
  }

  public async get (id: number) {
    return Configuration.findOrFail(id)
  }
}
