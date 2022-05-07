import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Blog from 'App/Models/Blog'

export default class BlogLocalization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Blog, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public blog: BelongsTo<typeof Blog>

  @column()
  public titleEn: string

  @column()
  public titleRu: string

  @column()
  public excerptEn: string

  @column()
  public excerptRu: string

  @column()
  public contentEn: string

  @column()
  public contentRu: string
}
