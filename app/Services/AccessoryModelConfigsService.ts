import AccessoryModelConfig from 'App/Models/AccessoryModelConfig'
import AccessoryModelConfigValidator from 'App/Validators/AccessoryModelConfig/AccessoryModelConfigValidator'

export default class AccessoryModelConfigsService {
  /**
   * Creates new model config
   * @param payload payload
   * @returns is created
   */
  public async create (payload: AccessoryModelConfigValidator['schema']['props']) {
    const config = await AccessoryModelConfig.create({
      id: payload.id,
      preConditions: payload.pre_conditions,
      postConditions: payload.post_conditions,
    })

    return config.$isPersisted
  }
  /**
   * Edits model config
   * @param config config
   * @param payload payload
   * @returns is updated
   */
  public async update (config: AccessoryModelConfig, payload: AccessoryModelConfigValidator['schema']['props']) {
    config.preConditions = payload.pre_conditions
    config.postConditions = payload.post_conditions

    await config.save()

    return config.$isPersisted
  }
}
