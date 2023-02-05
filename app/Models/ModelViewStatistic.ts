import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ModelViewStatistic extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public modelId: number

  @column()
  public uid: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
