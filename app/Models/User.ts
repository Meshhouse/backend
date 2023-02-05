import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import ApiToken from 'App/Models/ApiToken'
import Subscription from 'App/Models/Subscription'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: string

  @column()
  public name: string

  @hasMany(() => ApiToken, {
    foreignKey: 'user_id',
  })
  public tokens: HasMany<typeof ApiToken>

  @manyToMany(() => Subscription, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'subscription_id',
    pivotTable: 'user_subscription',
  })
  public subscriptions: ManyToMany<typeof Subscription>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public emailVerifiedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
