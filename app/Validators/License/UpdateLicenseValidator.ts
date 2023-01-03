import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import type { LicenseAccess } from '@meshhouse/types'

export default class UpdateLicenseValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
    access: schema.enum<LicenseAccess[]>(['free', 'subscriber', 'subscriber-continious']),
    mature_content: schema.boolean(),
    copyright_content: schema.boolean(),
    title_en: schema.string(),
    title_ru: schema.string(),
    description_en: schema.string.optional(),
    description_ru: schema.string.optional(),
  })

  public messages = {}
}
