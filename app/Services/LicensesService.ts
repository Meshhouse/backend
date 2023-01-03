import License from 'App/Models/License'
import CreateLicenseValidator from 'App/Validators/License/CreateLicenseValidator'
import UpdateLicenseValidator from 'App/Validators/License/UpdateLicenseValidator'
import type { License as LicenseType } from '@meshhouse/types'

export default class LicensesService {
  /**
   * Prepares licenses array
   * @param licenses licenses
   * @param language localization
   * @returns
   */
  public prepareLicenses (licenses: License[], language: string | null) {
    return licenses.map((license) => {
      const item = license.toJSON()

      if (!language) {
        item.title_en = item.locales.title_en
        item.title_ru = item.locales.title_ru
        item.description_en = item.locales.description_en
        item.description_ru = item.locales.description_ru
      } else {
        item.title = item.locales[`title_${language}`]
        item.description = item.locales[`description_${language}`]
      }

      delete item.locales

      return item as LicenseType
    })
  }
  /**
   * Prepares single license object
   * @param license license
   * @returns
   */
  public prepareSingleLicense (license: License) {
    const item = license.toJSON()

    item.title_en = license.locales.titleEn
    item.title_ru = license.locales.titleRu
    item.description_en = license.locales.descriptionEn
    item.description_ru = license.locales.descriptionRu

    delete item.locales

    return item
  }
  /**
   * Creates new license
   * @param payload payload
   * @returns license id
   */
  public async create (payload: CreateLicenseValidator['schema']['props']) {
    const license = await License.create({
      access: payload.access,
      matureContent: payload.mature_content,
      copyrightContent: payload.copyright_content,
    })

    await license.related('locales').create({
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en,
      descriptionRu: payload.description_ru,
    })

    return license.id
  }
  /**
   * Updates license
   * @param license license
   * @param payload payload
   * @returns license id
   */
  public async update (license: License, payload: UpdateLicenseValidator['schema']['props']) {
    license.access = payload.access
    license.matureContent = payload.mature_content
    license.copyrightContent = payload.copyright_content

    await license.related('locales').updateOrCreate({ id: payload.id }, {
      id: payload.id,
      titleRu: payload.title_ru,
      titleEn: payload.title_en,
      descriptionEn: payload.description_en || '',
      descriptionRu: payload.description_ru || '',
    })

    await license.save()

    return license.id
  }
  /**
   * Deletes license
   * @param license license
   * @returns is deleted
   */
  public async delete (license: License) {
    await license.related('locales')
      .query()
      .delete()
      .where('id', license.id)

    await license.delete()

    return license.$isDeleted
  }
}
