import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModelCategoryFilters extends BaseSchema {
  protected tableName = 'model_category_filters'

  public async up () {
    if (!await this.schema.hasTable(this.tableName)) {
      this.schema.createTable(this.tableName, (table) => {
        table.bigIncrements('id')
        table.integer('model_id').unsigned().references('models.id').onDelete('CASCADE')
        table.integer('filter_id').unsigned().references('category_filters.id').onDelete('CASCADE')
        table.string('value').notNullable()
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
      })
    }
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
