import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_filters_pivot'
  protected oldFilterTableName = 'category_filters'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').unsigned()
      table.bigInteger('category_id').unsigned().references('categories.id').onDelete('CASCADE')
      table.bigInteger('filter_id').unsigned().references('category_filters.id').onDelete('CASCADE')
      table.unique(['category_id', 'filter_id'])
    })

    this.defer(async (db) => {
      const filters = await db.from(this.oldFilterTableName).select('*').orderBy('id', 'asc')
      await Promise.all(filters.map((filter) => {
        return db
          .table(this.tableName)
          .insert({
            category_id: filter.category,
            filter_id: filter.id,
          })
      }))
    })

    this.schema.alterTable(this.oldFilterTableName, (table) => {
      table.dropColumn('category')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
