import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'password_reset_codes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('code').notNullable().defaultTo('')
      table.boolean('has_sended').defaultTo(false)
      table.timestamp('valid_until', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
