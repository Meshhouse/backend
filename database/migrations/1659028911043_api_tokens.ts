import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'api_tokens'

  public async up () {
    if (!await this.schema.hasColumn(this.tableName, 'limit_per_hour')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.integer('limit_per_hour').notNullable().defaultTo(1000).after('token')
      })
    }
  }

  public async down () {
    if (await this.schema.hasColumn(this.tableName, 'limit_per_hour')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('limit_per_hour')
      })
    }
  }
}
