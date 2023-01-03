import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class MakeService extends BaseCommand {
  @args.string()
  public name: string
  public static commandName = 'make:service'
  public static description = 'Make a new service class'
  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run () {
    this.generator
      .addFile(this.name, {
        form: 'plural',
        extname: '.ts',
        pattern: 'pascalcase',
        suffix: 'Service',
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('app/Services')
      .useMustache()
      .stub(join(__dirname, './templates/service.txt'))
      .apply({ name: this.name })

    await this.generator.run()
  }
}
