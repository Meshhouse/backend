import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryModels extends BaseSchema {
  protected tableName = 'category_model'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('model_id').unsigned().references('models.id')
      table.integer('category_id').unsigned().references('categories.id')
      table.unique(['model_id', 'category_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
