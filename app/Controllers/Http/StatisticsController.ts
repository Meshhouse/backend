import Model from 'App/Models/Model'
import ModelViewStatistic from 'App/Models/ModelViewStatistic'
import ModelDownloadStatistic from 'App/Models/ModelDownloadStatistic'
import ModelLike from 'App/Models/ModelLike'
import ModelStatisticValidator from 'App/Validators/ModelStatisticValidator'
import UpdateStatisticValidator from 'App/Validators/UpdateStatisticValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StatisticsController {
  /**
   * Handles add/remove like event from model
   * @param ctx context
   */
  public async like (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateStatisticValidator)

    if (payload.model_id && ctx.auth.user) {
      await Model.findOrFail(payload.model_id)

      try {
        const entry = await ModelLike
          .query()
          .select('*')
          .where('model_id', payload.model_id)
          .andWhere('user_id', ctx.auth.user.id)
          .firstOrFail()

        await entry.delete()
        return ctx.response.ok('')
      } catch (error) {
        await ModelLike.create({
          modelId: payload.model_id,
          userId: ctx.auth.user.id,
        })

        return ctx.response.ok('')
      }
    }
  }
  /**
   * Handles add view model event to statistic
   * @param ctx
   * @returns
   */
  public async viewModel (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateStatisticValidator)

    if (payload.model_id) {
      try {
        await ModelViewStatistic
          .query()
          .select('*')
          .where('model_id', payload.model_id)
          .andWhere('uid', payload.uid)
          .firstOrFail()

        return ctx.response.ok('')
      } catch (error) {
        await ModelViewStatistic.create({
          modelId: payload.model_id,
          uid: payload.uid,
        })
        return ctx.response.ok('')
      }
    }
  }
  /**
   * Handles add download model event to statistics
   * @param ctx
   * @returns
   */
  public async downloadModel (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateStatisticValidator)

    if (payload.model_id && payload.file_id) {
      try {
        await ModelDownloadStatistic
          .query()
          .select('*')
          .where('model_id', payload.model_id)
          .andWhere('file_id', payload.file_id)
          .andWhere('uid', payload.uid)
          .firstOrFail()

        return ctx.response.ok('')
      } catch (error) {
        await ModelDownloadStatistic.create({
          modelId: payload.model_id,
          fileId: payload.file_id,
          uid: payload.uid,
        })

        return ctx.response.ok('')
      }
    }
  }
  /**
   * Returns by-model statistics
   * @param ctx context
   * @returns by-model statistics
   */
  public async modelStatistics (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ModelStatisticValidator)

    if (payload.ids.length > 0) {
      const statistics: { [key: string]: Record<string, number> } = {}

      const [modelViews, modelLikes, modelDownloads] = await Promise.all([
        ModelViewStatistic
          .query()
          .select('model_id')
          .count('*', 'count')
          .whereIn('model_id', payload.ids)
          .groupBy('model_id'),
        ModelLike
          .query()
          .select('model_id')
          .count('*', 'count')
          .whereIn('model_id', payload.ids)
          .groupBy('model_id'),
        ModelDownloadStatistic
          .query()
          .select('model_id')
          .countDistinct('uid', 'count')
          .whereIn('model_id', payload.ids)
          .groupBy('model_id'),
      ])

      payload.ids.map((id) => {
        if (!statistics[id]) {
          statistics[id] = {
            views: 0,
            likes: 0,
            downloads: 0,
          }
        }

        statistics[id].views = modelViews.find(item => item.$attributes.modelId === id)?.$extras.count || 0
        statistics[id].likes = modelLikes.find(item => item.$attributes.modelId === id)?.$extras.count || 0
        statistics[id].downloads = modelDownloads.find(item => item.$attributes.modelId === id)?.$extras.count || 0
      })

      return statistics
    }

    return {}
  }
  /**
   * Returns model statistic
   * @param ctx context
   * @returns model statistic
   */
  public async singleModelStatistics (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ModelStatisticValidator)
    const statistics: Record<string, number | boolean | Record<string, number>> = {
      views: 0,
      likes: 0,
      user_liked: false,
      downloads: {},
    }

    if (payload.ids.length > 0) {
      const modelId = payload.ids[0]

      const [modelViews, modelLikes, modelDownloads] = await Promise.all([
        ModelViewStatistic
          .query()
          .select('model_id')
          .count('*', 'count')
          .where('model_id', modelId)
          .groupBy('model_id'),
        ModelLike
          .query()
          .select('model_id', 'user_id')
          .where('model_id', modelId),
        ModelDownloadStatistic
          .query()
          .select('file_id')
          .countDistinct('uid', 'count')
          .where('model_id', modelId)
          .groupBy('file_id'),
      ])

      statistics.views = modelViews.find(item => item.modelId === modelId)?.$extras.count || 0
      statistics.likes = modelLikes.length

      modelDownloads.map((item) => {
        statistics.downloads[item.fileId] = item.$extras.count
      })

      if (ctx.auth.user && ctx.auth.user.id) {
        statistics.user_liked = modelLikes.find(item => item.userId === ctx.auth.user?.id) !== undefined
      }
    }

    return statistics
  }
}
