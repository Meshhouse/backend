import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_filter_localizations'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('description_en').nullable().after('title_ru')
      table.string('description_ru').nullable().after('title_ru')
      table.string('unit_en').nullable().after('title_ru')
      table.string('unit_ru').nullable().after('title_ru')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('description_en', 'description_ru', 'unit_en', 'unit_ru')
    })
  }
}
