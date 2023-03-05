import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Banner from 'App/Models/Banner'

export default class BannerProperty extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Banner, {
    foreignKey: 'id',
    localKey: 'id',
  })
  public banner: BelongsTo<typeof Banner>

  @column()
  public page: string | null

  @column()
  public category: number | null
}
