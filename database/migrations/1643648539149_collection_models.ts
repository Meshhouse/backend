import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CollectionModels extends BaseSchema {
  protected tableName = 'collection_models'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('model_id').unsigned().references('models.id')
      table.integer('collection_id').unsigned().references('collections.id')
      table.unique(['model_id', 'collection_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
