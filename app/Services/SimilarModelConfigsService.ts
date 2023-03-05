import SimilarModelConfig from 'App/Models/SimilarModelConfig'
import SimilarModelConfigValidator from 'App/Validators/SimilarModelConfig/SimilarModelConfigValidator'

export default class SimilarModelConfigsService {
  /**
   * Creates new model config
   * @param payload payload
   * @returns is created
   */
  public async create (payload: SimilarModelConfigValidator['schema']['props']) {
    const config = await SimilarModelConfig.create({
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
  public async update (config: SimilarModelConfig, payload: SimilarModelConfigValidator['schema']['props']) {
    config.preConditions = payload.pre_conditions
    config.postConditions = payload.post_conditions

    await config.save()

    return config.$isPersisted
  }
}
