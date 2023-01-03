import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import StaticPage from 'App/Models/StaticPage'

export default class StaticPageLocalization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => StaticPage, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public model: BelongsTo<typeof StaticPage>

  @column()
  public titleEn: string

  @column()
  public titleRu: string

  @column()
  public contentEn: string

  @column()
  public contentRu: string
}
