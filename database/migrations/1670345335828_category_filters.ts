import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_filters'

  public async up () {
    if (!await this.schema.hasColumn(this.tableName, 'multiple_values')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.boolean('multiple_values').after('value_delimeter').defaultTo(false)
      })
    }

    if (!await this.schema.hasColumn(this.tableName, 'visible')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.boolean('visible').after('value_delimeter').defaultTo(true)
      })
    }
  }

  public async down () {
    if (await this.schema.hasColumn(this.tableName, 'multiple_values')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('multiple_values')
      })
    }

    if (await this.schema.hasColumn(this.tableName, 'visible')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('visible')
      })
    }
  }
}
