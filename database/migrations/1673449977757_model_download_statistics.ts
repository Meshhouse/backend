import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'model_download_statistics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('model_id').unsigned().references('models.id').onDelete('CASCADE')
      table.integer('file_id').unsigned().references('model_files.id').onDelete('CASCADE')
      table.string('uid').notNullable()
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
