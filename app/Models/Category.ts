import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  ManyToMany,
  manyToMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
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

  @manyToMany(() => CategoryFilter, {
    localKey: 'id',
    pivotForeignKey: 'category_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'filter_id',
    pivotTable: 'category_filters_pivot',
  })
  public filters: ManyToMany<typeof CategoryFilter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
