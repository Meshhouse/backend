import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModelsLocalizations extends BaseSchema {
  protected tableName = 'models_localizations'

  public async up () {
    this.schema.raw(`
      CREATE VIRTUAL TABLE ${this.tableName} USING fts5(title_en, title_ru, description_en, description_ru, tags_en, tags_ru, tokenize = 'trigram')
    `)
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
