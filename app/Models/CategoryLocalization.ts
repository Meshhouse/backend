import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'

export default class CategoryLocalization extends BaseModel {
  public static table = 'categories_localization'

  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Category, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public category: BelongsTo<typeof Category>

  @column()
  public titleEn: string

  @column()
  public titleRu: string

  @column()
  public descriptionEn: string

  @column()
  public descriptionRu: string
}
