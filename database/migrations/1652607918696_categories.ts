import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
  protected tableName = 'categories'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('order').notNullable().defaultTo(0).after('parent_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
