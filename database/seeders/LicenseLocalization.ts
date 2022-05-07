import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LicenseLocalization from 'App/Models/LicenseLocalization'

export default class LicenseLocalizationSeeder extends BaseSeeder {
  public async run () {
    await LicenseLocalization.createMany([
      {
        titleEn: 'Standart license',
        titleRu: 'Стандартная лицензия',
        descriptionEn: 'Lorem ipsum',
        descriptionRu: 'Lorem ipsum',
      },
      {
        titleEn: 'Standart license - Supporter',
        titleRu: 'Стандартная лицензия - Поддержка',
        descriptionEn: 'Lorem ipsum',
        descriptionRu: 'Lorem ipsum',
      },
      {
        titleEn: 'Copyright license',
        titleRu: 'Copyright лицензия',
        descriptionEn: 'Lorem ipsum',
        descriptionRu: 'Lorem ipsum',
      },
      {
        titleEn: 'Copyright license - Supporter',
        titleRu: 'Copyright лицензия - Поддержка',
        descriptionEn: 'Lorem ipsum',
        descriptionRu: 'Lorem ipsum',
      },
      {
        titleEn: 'Mature content license',
        titleRu: 'Лицензия контента для взрослых',
        descriptionEn: 'Lorem ipsum',
        descriptionRu: 'Lorem ipsum',
      },
      {
        titleEn: 'Mature content license - Supporter',
        titleRu: 'Лицензия контента для взрослых - Поддержка',
        descriptionEn: 'Lorem ipsum',
        descriptionRu: 'Lorem ipsum',
      },
    ])
  }
}
