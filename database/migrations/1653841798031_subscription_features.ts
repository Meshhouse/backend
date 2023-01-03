import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubscriptionFeatures extends BaseSchema {
  protected tableName = 'subscription_features'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('follower_nickname')
      table.boolean('get_sources')
      table.boolean('sponsor_image')
      table.boolean('no_courtesy')
      table.boolean('no_courtesy_mature_content')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
