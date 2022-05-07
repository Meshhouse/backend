import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Licenses extends BaseSchema {
  protected tableName = 'licenses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('access').notNullable()
      table.boolean('mature_content').defaultTo(false)
      table.boolean('copyright_content').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
