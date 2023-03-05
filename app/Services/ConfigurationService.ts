/* eslint-disable max-len */
import Configuration from 'App/Models/Configuration'
import CreateConfigurationValidator from 'App/Validators/Configuration/CreateConfigurationValidator'
import UpdateConfigurationValidator from 'App/Validators/Configuration/UpdateConfigurationValidator'

export default class ConfigurationService {
  /**
   * Transforms config to usable variants
   * @param configs original configs
   * @returns transformed configs
   */
  public prepare (configs: Configuration[]) {
    return configs.map((config) => this.prepareSingle(config))
  }
  /**
   * Transforms config to usable variants
   * @param configs original config
   * @returns transformed config
   */
  public prepareSingle (config: Configuration) {
    const serialized = typeof config.toJSON === 'function'
      ? config.toJSON()
      : config

    switch (serialized.type) {
      case 'array':
      case 'object':
        serialized.value = JSON.parse(serialized.value)
        break
      case 'number':
        serialized.value = parseFloat(serialized.value)
        break
      case 'boolean':
        serialized.value = serialized.value === '1' || serialized.value === 1
        break
    }

    return serialized
  }
  /**
   * Created new config
   * @param payload payload
   * @returns is created
   */
  public async create (payload: CreateConfigurationValidator['schema']['props'] & { value?: unknown }) {
    const config = await Configuration.create({
      key: payload.key,
      group: payload.group,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      value: payload.value,
    })

    return config.$isPersisted
  }
  /**
   * Updates config
   * @param config config
   * @param payload payload
   * @returns is updated
   */
  public async update (config: Configuration, payload: UpdateConfigurationValidator['schema']['props'] & {value?: unknown}) {
    config.key = payload.key
    config.group = payload.group
    config.title = payload.title
    config.description = payload.description
    config.type = payload.type
    config.value = payload.value

    await config.save()

    return config.$isPersisted
  }
  /**
   * Deletes config
   * @param config config
   * @returns is deleted
   */
  public async delete (config: Configuration) {
    await config.delete()

    return config.$isDeleted
  }
}
