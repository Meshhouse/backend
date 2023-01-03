import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserSubscriptions extends BaseSchema {
  protected tableName = 'user_subscription'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id')
      table.integer('subscription_id').unsigned().references('subscriptions.id')
      table.unique(['user_id', 'subscription_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
