import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import LicensesRepository from 'App/Repositories/LicensesRepository'
import LicensesService from 'App/Services/LicensesService'
import CreateLicenseValidator from 'App/Validators/License/CreateLicenseValidator'
import UpdateLicenseValidator from 'App/Validators/License/UpdateLicenseValidator'
import PathIdValidator from 'App/Validators/Shared/PathIdValidator'
import BodyIdValidator from 'App/Validators/Shared/BodyIdValidator'

@inject()
export default class LicensesController {
  constructor (
    public LicensesRepository: LicensesRepository,
    public LicensesService: LicensesService
  ) {}

  /**
   * Get licenses
   * @param ctx context
   * @returns licenses
   */
  public async list (ctx: HttpContextContract) {
    const licenses = await this.LicensesRepository.get()
    return this.LicensesService.prepareLicenses(licenses, ctx.xLanguage)
  }
  /**
   * Get single category
   * @param ctx context
   * @returns category or error
   */
  public async single (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(PathIdValidator)

    const license = await this.LicensesRepository.getById(payload.params.id)
    return this.LicensesService.prepareSingleLicense(license)
  }
  /**
   * Create license
   * @param ctx context
   * @returns license id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateLicenseValidator)
    await ctx.bouncer.authorize('viewAdmin')

    return await this.LicensesService.create(payload)
  }
  /**
   * Update license
   * @param ctx context
   * @returns category id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateLicenseValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const license = await this.LicensesRepository.getById(payload.id)
    return await this.LicensesService.update(license, payload)
  }
  /**
   * Delete license
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(BodyIdValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const license = await this.LicensesRepository.getById(payload.id)
    return await this.LicensesService.delete(license)
  }
}
