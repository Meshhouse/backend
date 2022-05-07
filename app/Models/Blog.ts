import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import BlogLocalization from 'App/Models/BlogLocalization'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public thumbnail: string | null

  @hasOne(() => BlogLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof BlogLocalization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
