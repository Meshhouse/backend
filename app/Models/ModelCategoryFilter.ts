import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ModelCategoryFilter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public modelId: number

  @column()
  public filterId: number

  @column()
  public value: unknown

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
