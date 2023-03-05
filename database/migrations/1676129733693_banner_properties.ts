import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'banner_properties'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().references('banners.id').onDelete('CASCADE')
      table.string('page').nullable().defaultTo(null)
      table.integer('category').nullable().defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
