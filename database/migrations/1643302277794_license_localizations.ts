import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LicenseLocalizations extends BaseSchema {
  protected tableName = 'license_localizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title_en').notNullable()
      table.string('title_ru').notNullable()
      table.text('description_en').nullable()
      table.text('description_ru').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
