import fs from 'fs/promises'
import Application from '@ioc:Adonis/Core/Application'
import { inject } from '@adonisjs/fold'
import LocalizationsRepository from 'App/Repositories/LocalizationsRepository'
import LocalizationsService from 'App/Services/LocalizationsService'
import GetLocalizationValidator from 'App/Validators/Localization/GetLocalizationValidator'
import UpdateLocalizationValidator from 'App/Validators/Localization/UpdateLocalizationValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

@inject()
export default class LocalizationsController {
  constructor (
    public LocalizationsRepository: LocalizationsRepository,
    public LocalizationsService: LocalizationsService
  ) {}

  public async get (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(GetLocalizationValidator)

    try {
      const file = await fs.readFile(Application.tmpPath(`cache/localization_${payload.language}.json`), {
        encoding: 'utf8',
      })
      return JSON.parse(file)
    } catch (error) {
      return ctx.response.notFound()
    }
  }

  public async listAdmin (ctx: HttpContextContract) {
    await ctx.bouncer.allows('viewAdmin')
    return await this.LocalizationsRepository.get()
  }

  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateLocalizationValidator)
    await ctx.bouncer.allows('viewAdmin')
    const currentEntries = await this.LocalizationsRepository.get()

    return await this.LocalizationsService.update(payload.items, currentEntries)
  }
}
