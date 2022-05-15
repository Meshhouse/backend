import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryFilters extends BaseSchema {
  protected tableName = 'category_filters'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.integer('category').unsigned().references('categories.id').onDelete('CASCADE')
      table.integer('order').unsigned().notNullable()
      table.string('key').unique().notNullable()
      table.string('type').notNullable()
      table.string('querystring_alias').unique().notNullable()
      table.string('value_delimeter').nullable().defaultTo(null),
      table.json('values').notNullable().defaultTo([])

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
