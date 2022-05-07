import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import CollectionLocalization from 'App/Models/CollectionLocalization'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @hasOne(() => CollectionLocalization, {
    foreignKey: 'id',
  })
  public locales: HasOne<typeof CollectionLocalization>
}
