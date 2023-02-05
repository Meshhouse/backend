import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ModelLike extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public modelId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
