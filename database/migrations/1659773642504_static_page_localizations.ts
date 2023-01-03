import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'static_page_localizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title_en').notNullable()
      table.string('title_ru').notNullable()
      table.text('content_en').nullable()
      table.text('content_ru').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
