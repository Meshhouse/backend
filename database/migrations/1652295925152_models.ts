import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Models extends BaseSchema {
  protected tableName = 'models'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('textures_link_size').notNullable().defaultTo(0).after('textures_link')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
