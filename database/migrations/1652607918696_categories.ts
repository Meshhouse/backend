import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
  protected tableName = 'categories'

  public async up () {
    if (!await this.schema.hasColumn(this.tableName, 'order')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.integer('order').notNullable().defaultTo(0).after('parent_id')
      })
    }
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('order')
    })
  }
}
