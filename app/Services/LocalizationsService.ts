import fs from 'fs/promises'
import Application from '@ioc:Adonis/Core/Application'
import Localization from 'App/Models/Localization'
import UpdateLocalizationValidator from 'App/Validators/Localization/UpdateLocalizationValidator'
import { set } from 'lodash'

export default class LocalizationsService {
  public async update (items: UpdateLocalizationValidator['schema']['props']['items'], currentEntries: Localization[]) {
    const deletedKeys = currentEntries.filter(x => !items.find(item => item.key === x.key))

    if (deletedKeys.length > 0) {
      for (const key of deletedKeys) {
        await key.delete()
      }
    }

    await Localization.updateOrCreateMany('key', items)
    return await this.syncCache(items)
  }

  public async syncCache (items: UpdateLocalizationValidator['schema']['props']['items']) {
    const locales = {
      en: {},
      ru: {},
    }

    items.map((item) => {
      set(locales.en, item.key, item.en)
      set(locales.ru, item.key, item.ru)
    })

    for (const language in locales) {
      await fs.writeFile(Application.tmpPath(`cache/localization_${language}.json`), JSON.stringify(locales[language]))
    }
  }
}
