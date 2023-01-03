import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { BlockTypeEnums } from '../../../types/Block'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type {
  BlockType,
} from '@meshhouse/types'

export default class CreateBlockValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum<BlockType[]>(BlockTypeEnums),
    content: schema.array().members(schema.object().anyMembers()),
  })

  public messages: CustomMessages = {}
}
