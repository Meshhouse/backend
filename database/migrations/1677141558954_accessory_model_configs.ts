import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'accessory_model_configs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().references('categories.id').onDelete('CASCADE')
      table.json('pre_conditions').notNullable().defaultTo('[]')
      table.json('post_conditions').notNullable().defaultTo('[]')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
