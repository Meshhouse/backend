import { inject } from '@adonisjs/fold'
import Block from 'App/Models/Block'
import ImageService from 'App/Services/ImageService'
import CreateBlockValidator from 'App/Validators/Block/CreateBlockValidator'
import UpdateBlockValidator from 'App/Validators/Block/UpdateBlockValidator'
import type {
  BlockPayloadContent,
} from '@meshhouse/types'

@inject()
export default class BlocksService {
  constructor (public ImageService: ImageService) {}

  public prepareBlock (block: Block) {
    const serializedBlock = block.toJSON()
    serializedBlock.content.map((item) => {
      if (item.thumbnail) {
        item.thumbnail = this.ImageService.translateDomain(item.thumbnail)
      }
      if (item.logo) {
        item.logo = this.ImageService.translateDomain(item.logo)
      }
      if (item.background) {
        item.background = this.ImageService.translateDomain(item.background)
      }

      return item
    })

    return serializedBlock
  }
  /**
   * Creates new block
   * @param payload payload
   * @returns
   */
  public async create (payload: CreateBlockValidator['schema']['props']) {
    const block = await Block.create({
      type: payload.type,
      content: payload.content as BlockPayloadContent,
    })

    return block.$isPersisted
  }
  /**
   * Updates block
   * @param block block
   * @param payload payload
   * @returns block id
   */
  public async update (
    block: Block,
    payload: UpdateBlockValidator['schema']['props']
  ) {
    block.type = payload.type
    block.content = payload.content as BlockPayloadContent

    await block.save()

    return block.id
  }
  /**
   * Deleted block
   * @param block block
   * @returns is deleted
   */
  public async delete (block: Block) {
    await block.delete()
    return block.$isDeleted
  }
}
