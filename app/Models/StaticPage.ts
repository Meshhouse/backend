import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import StaticPageLocalization from 'App/Models/StaticPageLocalization'

export default class StaticPage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @hasOne(() => StaticPageLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof StaticPageLocalization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
