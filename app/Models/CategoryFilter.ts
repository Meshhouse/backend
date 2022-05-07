import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import CategoryFilterLocalization from 'App/Models/CategoryFilterLocalization'

export default class CategoryFilter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public type: string

  @column()
  public enums: unknown[]

  @hasOne(() => CategoryFilterLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof CategoryFilterLocalization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
