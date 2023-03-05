import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import BannerProperty from 'App/Models/BannerProperty'

export default class Banner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public type: 'static' | 'interactive'

  @column()
  public source: string

  @column()
  public href: string | null

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public status: boolean

  @hasOne(() => BannerProperty, {
    foreignKey: 'id',
  })
  public properties: HasOne<typeof BannerProperty>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
