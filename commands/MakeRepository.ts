import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class MakeRepository extends BaseCommand {
  @args.string()
  public name: string
  public static commandName = 'make:repository'
  public static description = 'Make a new repository class'
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
        suffix: 'Repository',
        formIgnoreList: ['Home', 'Auth', 'Login'],
      })
      .appRoot(this.application.appRoot)
      .destinationDir('app/Repositories')
      .useMustache()
      .stub(join(__dirname, './templates/repository.txt'))
      .apply({ name: this.name })

    await this.generator.run()
  }
}
