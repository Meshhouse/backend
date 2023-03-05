/* eslint-disable max-len */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LicenseLocalization from 'App/Models/LicenseLocalization'

export default class LicenseLocalizationSeeder extends BaseSeeder {
  public async run () {
    await LicenseLocalization.createMany([
      {
        titleEn: 'Standart license',
        titleRu: 'Стандартная лицензия',
        descriptionEn: 'License used for most models, attribution recommended',
        descriptionRu: 'Лицензия, используемая для большинства моделей, указание авторства рекомендуется',
      },
      {
        titleEn: 'Standart license - Subscriber',
        titleRu: 'Стандартная лицензия - Подписчик',
        descriptionEn: 'Licensed for most models, no attribution required',
        descriptionRu: 'Лицензия, используемая для большинства моделей, указание авторства не требуется',
      },
      {
        titleEn: 'Copyright license',
        titleRu: 'Copyright лицензия',
        descriptionEn: 'License used for branded models, attribution recommended. Use of the model requires permission from the copyright holder',
        descriptionRu: 'Лицензия, используемая для брендированных моделей, указание авторства рекомендуется. Для использования модели требуется разрешение правообладателя',
      },
      {
        titleEn: 'Copyright license - Subscriber',
        titleRu: 'Copyright лицензия - Подписчик',
        descriptionEn: 'License used for branded models, no attribution required. Use of the model requires permission from the copyright holder',
        descriptionRu: 'Лицензия, используемая для брендированных моделей, указание авторства не требуется. Для использования модели требуется разрешение правообладателя',
      },
      {
        titleEn: 'Mature content license',
        titleRu: 'Лицензия контента для взрослых',
        descriptionEn: 'License used in adult content, attribution required',
        descriptionRu: 'Лицензия, используемая в контенте для взрослых, указание авторства обязательна',
      },
      {
        titleEn: 'Mature content license - Subscriber',
        titleRu: 'Лицензия контента для взрослых - Подписчик',
        descriptionEn: 'License used in adult content, no attribution required',
        descriptionRu: 'Лицензия, используемая в контенте для взрослых, указание авторства не требуется',
      },
    ])
  }
}
