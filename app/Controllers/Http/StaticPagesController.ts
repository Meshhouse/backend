// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import got from 'got'

export default class StaticPagesController {
  private GITHUB_TOKEN: string = Env.get('GITHUB_TOKEN')
  private ASSET_MIN_SIZE: number = 7000000

  public async applicationPC () {
    if (!this.GITHUB_TOKEN) {
      throw new Error('token not set')
    }

    const response = (await got<any[]>('https://api.github.com/repos/longsightedfilms/meshhouse/releases', {
      username: 'longsightedfilms',
      password: process.env.GITHUB_TOKEN || '',
      responseType: 'json',
    })).body

    const lastDraft = response.find((item) => item.draft)
    const lastRelease = response.find((item) => !item.draft)

    const draftReleaseVersion = lastDraft.tag_name.substr(1, lastDraft.tag_name.length)
    const draftAssets = lastDraft.assets.filter((asset) => {
      return asset.size > this.ASSET_MIN_SIZE
    })

    const releaseVersion = lastRelease.tag_name.substr(1, lastRelease.tag_name.length)
    const assets = lastRelease.assets.filter((asset) => {
      return asset.size > this.ASSET_MIN_SIZE
    })

    const draftAssetLinux = draftAssets.find((asset) => asset.name.indexOf('.AppImage') !== -1)
    const draftAssetWindows = draftAssets.find((asset) => asset.name.indexOf('.exe') !== -1)
    const draftAssetMac = draftAssets.find((asset) => asset.name.indexOf('.dmg') !== -1)

    const assetLinux = assets.find((asset) => asset.name.indexOf('.AppImage') !== -1)
    const assetWindows = assets.find((asset) => asset.name.indexOf('.exe') !== -1)
    const assetMac = assets.find((asset) => asset.name.indexOf('.dmg') !== -1)

    return {
      draft: {
        version: draftReleaseVersion,
        assets: {
          windows: draftAssetWindows.browser_download_url,
          mac: draftAssetMac.browser_download_url,
          linux: draftAssetLinux.browser_download_url,
        },
      },
      release: {
        version: releaseVersion,
        assets: {
          windows: assetWindows.browser_download_url,
          mac: assetMac.browser_download_url,
          linux: assetLinux.browser_download_url,
        },
      },
    }
  }
}
