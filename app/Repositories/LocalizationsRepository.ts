import Localization from 'App/Models/Localization'

export default class LocalizationsRepository {
  public async get () {
    return Localization
      .query()
      .select('*')
  }
}
