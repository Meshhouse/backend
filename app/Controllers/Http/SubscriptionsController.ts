import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { inject } from '@adonisjs/fold'
import Subscription from 'App/Models/Subscription'
import BoostyService from 'App/Services/BoostyService'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateSubscriptionValidator from 'App/Validators/CreateSubscriptionValidator'
import UpdateSubscriptionValidator from 'App/Validators/UpdateSubscriptionValidator'
import SyncSubscribersEmail from 'App/Mailers/SyncSubscribersEmail'

@inject()
export default class SubscriptionsController {
  constructor (
    public BoostyService: BoostyService
  ) {}

  /**
   * Get subscriptions list
   * @param ctx context
   * @returns subscriptions
   */
  public async list (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const items = await Subscription
      .query()
      .select('*')

    return items
  }
  /**
   * Get single subscription
   * @param ctx context
   * @returns subscriptions
   */
  public async single (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      params: schema
        .object()
        .members({
          id: schema.number(),
        }),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.allows('viewAdmin')

    const subscription = await Subscription
      .query()
      .preload('features')
      .select('*')
      .where({ id: payload.params.id })
      .firstOrFail()

    return subscription
  }
  /**
   * Create subscription
   * @param ctx context
   * @returns subscription id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateSubscriptionValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const subscription = await Subscription.create({
      serviceId: payload.service_id,
      service: payload.service,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      currency: payload.currency,
    })

    await subscription.related('features').create({
      followerNickname: payload.features.nickname,
      getSources: payload.features.source_files,
      sponsorImage: payload.features.sponsor_image,
      noCourtesy: payload.features.no_courtesy,
      noCourtesyMatureContent: payload.features.no_courtesy_mature_content,
    })

    return subscription.id
  }
  /**
   * Update subscription
   * @param ctx context
   * @returns subscription id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateSubscriptionValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const subscription = await Subscription.findOrFail(payload.id)

    subscription.serviceId = payload.service_id
    subscription.service = payload.service
    subscription.name = payload.name
    subscription.description = payload.description || ''
    subscription.price = payload.price
    subscription.currency = payload.currency

    await subscription.related('features').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      followerNickname: payload.features.nickname,
      getSources: payload.features.source_files,
      sponsorImage: payload.features.sponsor_image,
      noCourtesy: payload.features.no_courtesy,
      noCourtesyMatureContent: payload.features.no_courtesy_mature_content,
    })

    return subscription.id
  }
  /**
   * Delete subscription
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const subscription = await Subscription.findOrFail(payload.id)
    await subscription.related('features')
      .query()
      .delete()
      .where('id', payload.id)

    await subscription.delete()

    return subscription.$isDeleted
  }
  /**
   * Sync subscribers
   * @param ctx context
   * @returns sync status
   */
  public async sync (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')

    const stats = {
      fetched_subscriptions: 0,
      updated_subscriptions: 0,
      subscribed: 0,
      unsubscribed: 0,
      total_subscribed: 0,
    }

    const boostyStats = await this.BoostyService.syncSubscriptions()
    stats.fetched_subscriptions += boostyStats.fetched_subscriptions
    stats.updated_subscriptions += boostyStats.updated_subscriptions
    stats.subscribed += boostyStats.subscribed
    stats.unsubscribed += boostyStats.unsubscribed
    stats.total_subscribed += boostyStats.total_subscribed

    await new SyncSubscribersEmail(stats).send()
    return stats
  }
  /**
   * Get subscribers list
   * @param ctx context
   * @returns subscribers list
   */
  public async listSubscribers (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      page: schema.number(),
      count: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.allows('viewAdmin')

    const subscribersQuery = await Database
      .query()
      .select(
        'user_subscription.id',
        'users.name',
        'users.email',
        'subscriptions.service',
        'subscriptions.name as tier',
        'subscriptions.price',
        'subscriptions.currency'
      )
      .from('user_subscription')
      .leftJoin('users', (join) => {
        join.on('user_subscription.user_id', 'users.id')
      })
      .leftJoin('subscriptions', (join) => {
        join.on('user_subscription.subscription_id', 'subscriptions.id')
      })
      .paginate(payload.page, payload.count)

    return {
      pagination: {
        total: subscribersQuery.total,
        current_page: subscribersQuery.currentPage,
        last_page: subscribersQuery.lastPage,
      },
      items: subscribersQuery.toJSON().data,
    }
  }
  /**
   * Get subscribers statistics
   * @param ctx context
   * @returns subscribers statistics
   */
  public async adminStats (ctx: HttpContextContract) {
    const stats = {
      boosty: 0,
      patreon: 0,
    }

    await ctx.bouncer.allows('viewAdmin')

    const query = await Database
      .rawQuery(`
        SELECT
          subscriptions.service,
          sum(price) as 'total',
          subscriptions.currency
        FROM user_subscription
        LEFT JOIN subscriptions
          ON user_subscription.subscription_id = subscriptions.id
        GROUP BY subscriptions.service
      `)

    query.map((line) => {
      if (line.service === 'boosty') {
        stats.boosty = line.total
      }
      if (line.service === 'patreon') {
        stats.patreon = line.total
      }
    })

    return stats
  }
}
