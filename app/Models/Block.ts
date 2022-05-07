import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { BlockPayloadContent} from 'Contracts/Block'
import type { BlockType } from 'Contracts/Block'

export default class Block extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: BlockType

  @column({
    prepare: (value: BlockPayloadContent) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      return JSON.parse(value)
    },
  })
  public content: BlockPayloadContent

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
