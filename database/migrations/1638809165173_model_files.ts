import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModelFiles extends BaseSchema {
  protected tableName = 'model_files'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('model_id').unsigned().references('models.id').onDelete('CASCADE')
      table.text('url').unique().notNullable()
      table.string('program').notNullable()
      table.string('program_version').notNullable()
      table.string('renderer').notNullable()
      table.string('renderer_version').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
