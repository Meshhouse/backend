import { inject } from '@adonisjs/fold'
import Banner from 'App/Models/Banner'
import ImageService from 'App/Services/ImageService'
import CreateBannerValidator from 'App/Validators/Banner/CreateBannerValidator'
import UpdateBannerValidator from 'App/Validators/Banner/UpdateBannerValidator'

@inject()
export default class BannersService {
  constructor (
    public ImageService: ImageService
  ) {}
  /**
   * Prepares banner object
   * @param banner banner
   * @returns transformed object
   */
  public async prepare (banner: Banner) {
    if (banner.source) {
      banner.source = this.ImageService.translateDomain(banner.source)
    }

    return banner.toJSON()
  }
  /**
   * Creates new banner
   * @param payload payload
   * @returns is created
   */
  public async create (payload: CreateBannerValidator['schema']['props']) {
    const banner = await Banner.create({
      title: payload.title,
      type: payload.type,
      source: payload.source,
      href: payload.href,
      status: payload.status
    })

    await banner.related('properties').create({
      page: payload.page,
      category: payload.category,
    })

    return banner.$isPersisted
  }
  /**
   * Updates banner
   * @param banner banner
   * @param payload payload
   * @returns is updated
   */
  public async update (banner: Banner, payload: UpdateBannerValidator['schema']['props']) {
    banner.title = payload.title
    banner.type = payload.type
    banner.source = payload.source
    banner.href = payload.href || null
    banner.status = payload.status

    await banner.related('properties').updateOrCreate({}, {
      page: payload.page,
      category: payload.category,
    })

    await banner.save()

    return banner.$isPersisted
  }
  /**
   * Deletes banner
   * @param banner banner
   * @returns is deleted
   */
  public async delete (banner: Banner) {
    await banner.related('properties')
      .query()
      .delete()
      .where('id', banner.id)

    await banner.delete()

    return banner.$isDeleted
  }
}
