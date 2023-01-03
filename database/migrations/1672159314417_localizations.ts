import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'localizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('key').unique().notNullable()
      table.string('en').notNullable()
      table.string('ru').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
