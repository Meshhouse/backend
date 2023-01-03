import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Localization extends BaseModel {
  @column({ isPrimary: true })
  public key: string

  @column()
  public en: string

  @column()
  public ru: string
}
