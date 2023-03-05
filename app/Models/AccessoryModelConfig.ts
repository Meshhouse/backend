import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import type {
  AccessoryModelPreCondition,
  AccessoryModelPostCondition,
} from '@meshhouse/types'

export default class AccessoryModelConfig extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Category, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public category: BelongsTo<typeof Category>

  @column({
    prepare: (value: AccessoryModelPreCondition[]) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      try {
        const json = JSON.parse(value)
        return json
      } catch (error) {
        return value
      }
    },
  })
  public preConditions: AccessoryModelPreCondition[]

  @column({
    prepare: (value: AccessoryModelPostCondition[]) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      try {
        const json = JSON.parse(value)
        return json
      } catch (error) {
        return value
      }
    },
  })
  public postConditions: AccessoryModelPostCondition[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
