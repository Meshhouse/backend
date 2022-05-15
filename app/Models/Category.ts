import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import CategoryLocalization from 'App/Models/CategoryLocalization'
import CategoryFilter from 'App/Models/CategoryFilter'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public icon: string

  @column()
  public parentId: number | null

  @column()
  public order: number

  @hasOne(() => CategoryLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof CategoryLocalization>

  @hasMany(() => CategoryFilter, {
    foreignKey: 'categoryId',
  })
  public filters: HasMany<typeof CategoryFilter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
