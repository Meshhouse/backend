import got from 'got'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import Subscription from 'App/Models/Subscription'

import type {
  BoostySubscriptionResponse,
  BoostySubscription,
} from '@meshhouse/types'

/**
 * Boosty service, provides API messaging with backend
 */
export default class BoostyService {
  private pageUrl = 'meshhouse'
  private limitPerPage = 100
  private gotInstance = got.extend({
    prefixUrl: 'https://api.boosty.to/v1',
    headers: {
      authorization: 'Bearer 3b0cb617edba908408ff0754e9c7ab89c2daa8c183bc2c0e1c133076a8b21688',
    },
    responseType: 'json',
  })
  /**
   * Fetch subscriptions info
   * @param levelIds filter by subscription ids
   * @returns subscriptions
   */
  private async fetchSubscriptions (levelIds: number[]) {
    try {
      const subscriptions: BoostySubscription[] = []

      const response = await this.gotInstance<BoostySubscriptionResponse>({
        url: `blog/${this.pageUrl}/subscribers`,
        searchParams: {
          sort_by: 'on_time',
          limit: this.limitPerPage,
          level_ids: levelIds.toString(),
          offset: 0,
          order: 'gt',
        },
      })

      subscriptions.push(...response.body.data)

      if (response.body.total > this.limitPerPage) {
        const pages = Math.ceil(response.body.total / this.limitPerPage)
        for (let i = 1; i < pages; i++) {
          const result = await this.fetchSubscriptionsPerPage(i, levelIds)

          if (Array.isArray(result)) {
            subscriptions.push(...result)
          }
        }
      }

      return subscriptions.map((subscription) => {
        return {
          id: subscription.id,
          email: subscription.email,
          name: subscription.name,
          subscription_id: subscription.level.id,
          price: subscription.price,
          payments: subscription.payments,
          subscribed: subscription.subscribed,
        }
      })
    } catch (error) {
      throw error
    }
  }
  /**
   * Paginated fetch subscriptions info
   * @param page page
   * @param levelIds filter by subscription ids
   * @returns subscriptions
   */
  private async fetchSubscriptionsPerPage (page: number, levelIds: number[]) {
    try {
      const response = await this.gotInstance<BoostySubscriptionResponse>({
        url: `blog/${this.pageUrl}/subscribers`,
        searchParams: {
          sort_by: 'on_time',
          limit: this.limitPerPage,
          offset: page,
          level_ids: levelIds.toString(),
          order: 'gt',
        },
      })

      return response.body.data
    } catch (error) {
      throw error
    }
  }
  /**
   * Syncs subscriptions
   * @returns subscription stats
   */
  public async syncSubscriptions () {
    try {
      Logger.warn('Boosty sync started')
      const stats = {
        fetched_subscriptions: 0,
        updated_subscriptions: 0,
        subscribed: 0,
        unsubscribed: 0,
        total_subscribed: 0,
      }

      const availableSubscriptions = await Subscription
        .query()
        .select('id', 'service_id')
        .where('service', 'boosty')

      const subscriptionIds = availableSubscriptions.map((v) => v.serviceId)

      Logger.info(`Boosty subscription ids: ${subscriptionIds.toString()}`)
      Logger.debug('Starting fetch subscriptions')
      const fetchedSubscriptions = await this.fetchSubscriptions(subscriptionIds)
      Logger.debug('Subscriptions fetched')
      const filteredSubscriptions = fetchedSubscriptions.filter((sub) => sub.email)

      stats.fetched_subscriptions = fetchedSubscriptions.length

      const users = await User
        .query()
        .preload('subscriptions')
        .select('*')

      for (const user of users) {
        const subscription = filteredSubscriptions.find((sub) => sub.email === user.email)

        if (subscription) {
          const dbId = availableSubscriptions.find((sub) => sub.serviceId === subscription.id)?.id
          if (dbId) {
            const existSubscription = user.subscriptions.find((sub) => sub.$extras.subscription_id === dbId)

            if (!existSubscription && subscription.subscribed) {
              await user.related('subscriptions').attach([dbId])
              user.role = 'subscriber'
              await user.save()

              stats.updated_subscriptions++
              stats.subscribed++
            } else if (existSubscription && !subscription.subscribed) {
              await user.related('subscriptions').detach([dbId])

              if (!user.subscriptions.length) {
                user.role = 'basic'
                await user.save()
              }

              stats.updated_subscriptions++
              stats.unsubscribed++
            } else if (existSubscription && subscription.subscribed) {
              stats.total_subscribed++
            }
          }
        }
      }

      Logger.warn('Boosty sync completed')
      Logger.warn(`Fetched subscriptions: ${stats.fetched_subscriptions}`)
      Logger.warn(`Updated subscriptions: ${stats.updated_subscriptions}`)
      Logger.warn(`New subscribed users: ${stats.subscribed}`)
      Logger.warn(`Unsubscribed users: ${stats.unsubscribed}`)
      Logger.warn(`Total subscribed users: ${stats.total_subscribed}`)

      return stats
    } catch (error) {
      Logger.error('Boosty sync failed')
      throw error
    }
  }
}
