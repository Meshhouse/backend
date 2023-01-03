import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import CategoryFilter from 'App/Models/CategoryFilter'

export default class CategoryFilterLocalization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => CategoryFilter, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public categoryFilter: BelongsTo<typeof CategoryFilter>

  @column()
  public titleEn: string

  @column()
  public titleRu: string

  @column()
  public descriptionEn: string

  @column()
  public descriptionRu: string

  @column()
  public unitEn: string

  @column()
  public unitRu: string
}
