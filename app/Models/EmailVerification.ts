import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class EmailVerification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @column()
  public hash: string

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public validUntil: DateTime
}
