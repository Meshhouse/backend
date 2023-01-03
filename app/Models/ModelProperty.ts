import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Model from 'App/Models/Model'
import type {
  ModelRigging,
  ModelHairSystem,
  ModelTextures,
  ModelTexturesWrapping,
} from '@meshhouse/types'

export default class ModelProperty extends BaseModel {
  public static table = 'models_properties'

  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Model, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public model: BelongsTo<typeof Model>

  @column()
  public polygons: number

  @column()
  public vertices: number

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public blendshapes: boolean

  @column()
  public rig: ModelRigging | boolean

  @column()
  public hairSystem: ModelHairSystem | boolean

  @column()
  public textures: ModelTextures | boolean

  @column()
  public uv: ModelTexturesWrapping | boolean
}
