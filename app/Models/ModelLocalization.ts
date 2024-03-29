import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Model from 'App/Models/Model'

export default class ModelLocalization extends BaseModel {
  public static table = 'models_localizations'

  @column({ isPrimary: true })
  public rowid: number

  @belongsTo(() => Model, {
    localKey: 'rowid',
    foreignKey: 'id',
  })
  public model: BelongsTo<typeof Model>

  @column()
  public titleEn: string

  @column()
  public titleRu: string

  @column()
  public descriptionEn: string

  @column()
  public descriptionRu: string

  @column({
    prepare: (value: string[]) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      try {
        const json = JSON.parse(value)
        return json
      } catch (error) {
        return value
      }
    },
  })
  public tagsEn: string[]

  @column({
    prepare: (value: string[]) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      try {
        const json = JSON.parse(value)
        return json
      } catch (error) {
        return value
      }
    },
  })
  public tagsRu: string[]
}
