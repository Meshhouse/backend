import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'configurations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key').notNullable().defaultTo('')
      table.string('group').notNullable().defaultTo('')
      table.string('title').notNullable().defaultTo('')
      table.string('description').notNullable().defaultTo('')
      table.string('type').notNullable().defaultTo('')
      table.string('value').notNullable().defaultTo('')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
