import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModelsProperties extends BaseSchema {
  protected tableName = 'models_properties'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('polygons').notNullable()
      table.bigInteger('vertices').notNullable()
      table.boolean('blendshapes').defaultTo(false)
      table.string('rig').defaultTo(false)
      table.string('hair_system').defaultTo(false)
      table.string('textures').defaultTo(false)
      table.string('uv').defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
