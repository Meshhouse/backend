import StaticPage from 'App/Models/StaticPage'
import got from 'got'
import BasicPaginateValidator from 'App/Validators/Shared/BasicPaginateValidator'
import { GithubRelease } from 'Contracts/interfaces'

export default class StaticPagesRepository {
  /**
   * Gets static pages list
   * @param payload payload
   * @returns static pages
   */
  public async list (payload: BasicPaginateValidator['schema']['props']) {
    return StaticPage
      .query()
      .preload('locales')
      .select('*')
      .paginate(payload.page || 1, payload.count || 25)
  }
  /**
   * Gets static page by id
   * @param id id
   * @returns static page
   */
  public async getById (id: number) {
    return StaticPage
      .findOrFail(id)
  }
  /**
   * Gets static page by slug
   * @param slug slug
   * @returns static page
   */
  public async getBySlug (slug: string) {
    return StaticPage
      .query()
      .preload('locales')
      .select('*')
      .where('slug', slug)
      .firstOrFail()
  }

  public async getGithubPage () {
    const data = (await got<GithubRelease[]>('https://api.github.com/repos/longsightedfilms/meshhouse/releases', {
      username: 'longsightedfilms',
      password: process.env.GITHUB_TOKEN || '',
      responseType: 'json',
    })).body

    return data
  }
}
