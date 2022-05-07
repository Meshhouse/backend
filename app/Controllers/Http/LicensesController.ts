import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import License from 'App/Models/License'
import CreateLicenseValidator from 'App/Validators/CreateLicenseValidator'
import UpdateLicenseValidator from 'App/Validators/UpdateLicenseValidator'

import { LicenseInterface } from 'Contracts/license'

export default class LicensesController {
  /**
   * Get licenses
   * @param ctx context
   * @returns licenses
   */
  public async list (ctx: HttpContextContract): Promise<LicenseInterface[]> {
    const headersValidateSchema = schema.create({
      'x-meshhouse-language': schema.string.optional({}, [rules.language()]),
    })

    const headers = await validator.validate({
      schema: headersValidateSchema,
      data: ctx.request.headers(),
    })

    const language = headers['x-meshhouse-language'] ?? null

    const licenses = await License
      .query()
      .preload('locales')
      .select()

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

      return item as LicenseInterface
    })
  }
  /**
   * Get single category
   * @param ctx context
   * @returns category or error
   */
  public async single (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      params: schema
        .object()
        .members({
          id: schema.number(),
        }),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })

    const license = await License
      .query()
      .preload('locales')
      .select('*')
      .where({ id: payload.params.id })
      .firstOrFail()

    const item = license.toJSON()

    item.title_en = license.locales.titleEn
    item.title_ru = license.locales.titleRu
    item.description_en = license.locales.descriptionEn
    item.description_ru = license.locales.descriptionRu

    delete item.locales

    return item
  }
  /**
   * Create license
   * @param ctx context
   * @returns license id
   */
  public async create (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateLicenseValidator)
    await ctx.bouncer.authorize('viewAdmin')

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
   * Update license
   * @param ctx context
   * @returns category id
   */
  public async update (ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateLicenseValidator)
    await ctx.bouncer.authorize('viewAdmin')

    const license = await License.findOrFail(payload.id)

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

    return license.id
  }
  /**
   * Delete license
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      id: schema.number(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const license = await License.findOrFail(payload.id)
    await license.related('locales')
      .query()
      .delete()
      .where('id', payload.id)

    await license.delete()

    return license.$isDeleted
  }
}
