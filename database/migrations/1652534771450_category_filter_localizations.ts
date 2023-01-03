import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryFilterLocalizations extends BaseSchema {
  protected tableName = 'category_filter_localizations'

  public async up () {
    if (!await this.schema.hasTable(this.tableName)) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.string('title_en').notNullable()
        table.string('title_ru').notNullable()
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
      })
    }
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
