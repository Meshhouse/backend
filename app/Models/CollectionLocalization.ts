import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Collection from 'App/Models/Collection'

export default class CollectionLocalization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Collection, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public collection: BelongsTo<typeof Collection>

  @column()
  public titleEn: string

  @column()
  public titleRu: string
}
