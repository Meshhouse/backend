import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('service_id').notNullable()
      table.string('service').notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable().defaultTo('')
      table.decimal('price', 2, 10).notNullable().unsigned().defaultTo(0)
      table.string('currency').notNullable().defaultTo('$')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
