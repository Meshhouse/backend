import Block from 'App/Models/Block'

export default class BlocksRepository {
  /**
   * Gets block list
   * @returns
   */
  public async get () {
    return Block
      .query()
      .select('*')
  }
  /**
   * Gets block by id
   * @param id id
   * @returns block
   */
  public async getById (id: number) {
    return Block.findOrFail(id)
  }
  /**
   * Gets block by type
   * @param type type
   * @returns block
   */
  public async getByType (type: string) {
    return Block
      .query()
      .select('*')
      .where({ type })
      .firstOrFail()
  }
}
