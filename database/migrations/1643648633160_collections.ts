import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Collections extends BaseSchema {
  protected tableName = 'collections'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').notNullable().unique()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
