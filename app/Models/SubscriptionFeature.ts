import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SubscriptionFeature extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
    serializeAs: 'nickname',
  })
  public followerNickname: boolean

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
    serializeAs: 'source_files',
  })
  public getSources: boolean

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public sponsorImage: boolean

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public noCourtesy: boolean

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public noCourtesyMatureContent: boolean
}
