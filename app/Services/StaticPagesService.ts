import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import StaticPage from 'App/Models/StaticPage'
import CreateStaticPageValidator from 'App/Validators/StaticPage/CreateStaticPageValidator'
import UpdateStaticPageValidator from 'App/Validators/StaticPage/UpdateStaticPageValidator'
import { GithubRelease } from 'Contracts/interfaces'

export default class StaticPagesService {
  /**
   * Prepares static pages array
   * @param pages pages
   * @param language localization
   * @returns static pages
   */
  public prepareList (
    pages: ModelPaginatorContract<StaticPage>,
    language: string | null
  ) {
    const serialized = pages.serialize({
      relations: {
        locales: {
          fields: ['title_en', 'title_ru'],
        },
      },
    })

    return {
      pagination: {
        total: serialized.meta.total,
        current_page: serialized.meta.current_page,
        last_page: serialized.meta.last_page,
      },
      items: serialized.data.map((item) => {
        if (!language) {
          item.title_en = item.locales.title_en
          item.title_ru = item.locales.title_ru
        } else {
          item.title = item.locales[`title_${language}`]
        }

        delete item.locales

        return item
      }),
    }
  }
  /**
   * Prepares single static page
   * @param page page
   * @param language localization
   * @returns static page
   */
  public prepareSingle (
    page: StaticPage,
    language: string | null
  ) {
    const serialized = page.serialize({
      relations: {
        locales: {
          fields: ['title_en', 'content_en', 'title_ru', 'content_ru'],
        },
      },
    })

    if (!language) {
      serialized.title_en = serialized.locales.title_en
      serialized.title_ru = serialized.locales.title_ru
      serialized.content_en = serialized.locales.content_en
      serialized.content_ru = serialized.locales.content_ru
    } else {
      serialized.title = serialized.locales[`title_${language}`]
      serialized.content = serialized.locales[`content_${language}`]
    }

    delete serialized.locales

    return serialized
  }
  /**
   * Creates new static page
   * @param payload payload
   * @returns page id
   */
  public async createPage (payload: CreateStaticPageValidator['schema']['props']) {
    const page = await StaticPage.create({
      slug: payload.slug,
    })

    await page.related('locales').create({
      titleEn: payload.title_en,
      titleRu: payload.title_ru,
      contentEn: payload.content_en,
      contentRu: payload.content_ru,
    })

    return page.id
  }
  /**
   * Updates static page
   * @param page page
   * @param payload payload
   * @returns page id
   */
  public async updatePage (page: StaticPage, payload: UpdateStaticPageValidator['schema']['props']) {
    page.slug = payload.slug

    await page.related('locales').updateOrCreate({}, {
      titleEn: payload.title_en,
      titleRu: payload.title_ru,
      contentEn: payload.content_en,
      contentRu: payload.content_ru,
    })

    return page.id
  }
  /**
   * Deletes static page
   * @param page page
   * @returns is deleted
   */
  public async deletePage (page: StaticPage) {
    await page.related('locales')
      .query()
      .delete()
      .where('id', page.id)

    await page.delete()

    return page.$isDeleted
  }
  /**
   * Prepares Github release data
   * @param data Github release data
   * @returns prepared data
   */
  public prepareGithubData (data: GithubRelease[]) {
    const ASSET_MIN_SIZE = 7000000

    const lastDraft = data.find((item) => item.draft)
    const lastRelease = data.find((item) => !item.draft)

    const draftReleaseVersion = lastDraft?.tag_name.substring(1, lastDraft.tag_name.length)
    const draftAssets = lastDraft?.assets.filter((asset) => {
      return asset.size > ASSET_MIN_SIZE
    })

    const releaseVersion = lastRelease?.tag_name.substring(1, lastRelease.tag_name.length)
    const assets = lastRelease?.assets.filter((asset) => {
      return asset.size > ASSET_MIN_SIZE
    })

    const draftAssetLinux = draftAssets?.find((asset) => asset.name.indexOf('.AppImage') !== -1)
    const draftAssetWindows = draftAssets?.find((asset) => asset.name.indexOf('.exe') !== -1)
    const draftAssetMac = draftAssets?.find((asset) => asset.name.indexOf('.dmg') !== -1)

    const assetLinux = assets?.find((asset) => asset.name.indexOf('.AppImage') !== -1)
    const assetWindows = assets?.find((asset) => asset.name.indexOf('.exe') !== -1)
    const assetMac = assets?.find((asset) => asset.name.indexOf('.dmg') !== -1)

    return {
      draft: {
        version: draftReleaseVersion,
        assets: {
          windows: draftAssetWindows?.browser_download_url,
          mac: draftAssetMac?.browser_download_url,
          linux: draftAssetLinux?.browser_download_url,
        },
      },
      release: {
        version: releaseVersion,
        assets: {
          windows: assetWindows?.browser_download_url,
          mac: assetMac?.browser_download_url,
          linux: assetLinux?.browser_download_url,
        },
      },
    }
  }
}
