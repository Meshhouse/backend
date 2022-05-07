import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Models extends BaseSchema {
  protected tableName = 'models'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').notNullable().unique()
      table.integer('status').notNullable().defaultTo(1)
      table.boolean('mature_content').defaultTo(false)
      table.json('brands').defaultTo('[]')
      table.json('licenses').defaultTo('[]')
      table.json('install_paths').defaultTo('{}')
      table.text('textures_link').nullable()
      table.text('thumbnail').notNullable()
      table.json('images').defaultTo('[]')
      table.text('preview').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
