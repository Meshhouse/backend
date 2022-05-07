import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import type { LicenseAccess } from 'Contracts/license'

export default class CreateLicenseValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
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
