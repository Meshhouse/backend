import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BlogLocalizations extends BaseSchema {
  protected tableName = 'blog_localizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title_en').notNullable()
      table.string('title_ru').notNullable()
      table.text('excerpt_en').notNullable()
      table.text('excerpt_ru').notNullable()
      table.text('content_en').notNullable()
      table.text('content_ru').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
