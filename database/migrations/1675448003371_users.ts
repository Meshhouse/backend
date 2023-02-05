import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    if (!await this.schema.hasColumn(this.tableName, 'email_verified_at')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.timestamp('email_verified_at', { useTz: true })
      })
    }
  }

  public async down () {
    if (await this.schema.hasColumn(this.tableName, 'email_verified_at')) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('email_verified_at')
      })
    }
  }
}
