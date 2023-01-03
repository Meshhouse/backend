import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import BlocksRepository from 'App/Repositories/BlocksRepository'
import BlocksService from 'App/Services/BlocksService'
import CreateBlockValidator from 'App/Validators/Block/CreateBlockValidator'
import FindBlockValidator from 'App/Validators/Block/FindBlockValidator'
import UpdateBlockValidator from 'App/Validators/Block/UpdateBlockValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class BlocksController {
  constructor (
    public BlocksRepository: BlocksRepository,
    public BlocksService: BlocksService
  ) {}

  /**
   * Get blocks list
   * @returns blocks list
   */
  public async list () {
    return await this.BlocksRepository.get()
  }
  /**
   * Get single block
   * @param ctx context
   * @returns block
   */
  public async single (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(FindBlockValidator)
    const block = await this.BlocksRepository.getByType(payload.params.type)

    return this.BlocksService.prepareBlock(block)
  }
  /**
   * Create block
   * @param ctx context
   * @returns block id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateBlockValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.BlocksService.create(payload)
  }
  /**
   * Update block
   * @param ctx context
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateBlockValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const block = await this.BlocksRepository.getById(payload.id)
    return await this.BlocksService.update(block, payload)
  }
  /**
   * Delete block
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const block = await this.BlocksRepository.getById(payload.id)
    return await this.BlocksService.delete(block)
  }
}
