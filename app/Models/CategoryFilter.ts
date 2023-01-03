import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import CategoryFilterLocalization from 'App/Models/CategoryFilterLocalization'
import type {
  CategoryFilterType,
} from '@meshhouse/types'

export default class CategoryFilter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order: number

  @column()
  public key: string

  @column()
  public type: CategoryFilterType

  @column()
  public querystringAlias: string

  @column()
  public valueDelimeter: string | null

  @column({
    consume: (value: number) => {
      return value === 1
    },
  })
  public multipleValues: boolean

  @column({
    consume: (value: number) => {
      return value === 1
    },
  })
  public visible: boolean

  @column({
    prepare: (value: unknown[]) => {
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
  public values: unknown[]

  @hasOne(() => CategoryFilterLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof CategoryFilterLocalization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
