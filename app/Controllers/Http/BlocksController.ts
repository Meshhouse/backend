import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Block from 'App/Models/Block'
import { BlockType, BlockPayloadContent, BlockTypeEnums } from 'Contracts/Block'

export default class BlocksController {
  /**
   * Get blocks list
   * @returns blocks list
   */
  public async list () {
    const blocks = await Block
      .query()
      .select('*')

    return blocks
  }
  /**
   * Get single block
   * @param ctx context
   * @returns block
   */
  public async single (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      params: schema
        .object()
        .members({
          type: schema.string(),
        }),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const block = await Block
      .query()
      .select('*')
      .where({ type: payload.params.type })
      .firstOrFail()

    return block
  }
  /**
   * Create block
   * @param ctx context
   * @returns block id
   */
  public async create (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      type: schema.enum<BlockType[]>(BlockTypeEnums),
      content: schema.array().members(schema.object().anyMembers()),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const block = await Block.create({
      type: payload.type,
      content: payload.content as BlockPayloadContent,
    })

    return block.$isPersisted
  }
  /**
   * Update block
   * @param ctx context
   */
  public async update (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
      type: schema.enum<BlockType[]>(BlockTypeEnums),
      content: schema.array().members(schema.object().anyMembers()),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const block = await Block.find(payload.id)

    if (block) {
      block.type = payload.type
      block.content = payload.content as BlockPayloadContent

      await block.save()
    } else {
      throw new Error('block not found')
    }
  }
  /**
   * Delete block
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const block = await Block.find(payload.id)

    if (block) {
      await block.delete()

      return block.$isDeleted
    } else {
      throw new Error('block not found')
    }
  }
}
