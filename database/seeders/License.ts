import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import License from 'App/Models/License'

export default class LicenseSeeder extends BaseSeeder {
  public async run () {
    await License.createMany([
      {
        access: 'free',
        matureContent: false,
        copyrightContent: false,
      },
      {
        access: 'subscriber',
        matureContent: false,
        copyrightContent: false,
      },
      {
        access: 'free',
        matureContent: false,
        copyrightContent: true,
      },
      {
        access: 'subscriber',
        matureContent: false,
        copyrightContent: true,
      },
      {
        access: 'free',
        matureContent: true,
        copyrightContent: false,
      },
      {
        access: 'subscriber-continious',
        matureContent: true,
        copyrightContent: false,
      },
    ])
  }
}
