import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CollectionLocalizations extends BaseSchema {
  protected tableName = 'collection_localizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title_en').notNullable()
      table.string('title_ru').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
