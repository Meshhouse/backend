import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import SubscriptionFeature from 'App/Models/SubscriptionFeature'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public serviceId: number

  @column()
  public service: 'patreon' | 'boosty'

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public currency: string

  @hasOne(() => SubscriptionFeature, {
    foreignKey: 'id',
  })
  public features: HasOne<typeof SubscriptionFeature>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
