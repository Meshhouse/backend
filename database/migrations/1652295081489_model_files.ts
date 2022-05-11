import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModelFiles extends BaseSchema {
  protected tableName = 'model_files'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('size').notNullable().defaultTo(0).after('url')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
