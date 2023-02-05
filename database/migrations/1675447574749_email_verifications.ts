import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'email_verifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('hash').notNullable().defaultTo('')
      table.timestamp('valid_until', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
