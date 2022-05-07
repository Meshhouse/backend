import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import License from 'App/Models/License'

export default class LicenseLocalization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => License, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public license: BelongsTo<typeof License>

  @column()
  public titleEn: string

  @column()
  public titleRu: string

  @column()
  public descriptionEn: string

  @column()
  public descriptionRu: string
}
