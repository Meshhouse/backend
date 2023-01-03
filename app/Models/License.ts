import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import LicenseLocalization from 'App/Models/LicenseLocalization'

import type { LicenseAccess } from '@meshhouse/types'

export default class License extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => LicenseLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof LicenseLocalization>

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public copyrightContent: boolean

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public matureContent: boolean

  @column()
  public access: LicenseAccess

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
