import { DateTime } from 'luxon'

export type LicenseAccess = 'free' | 'subscriber' | 'subscriber-continious'

export interface LicenseInterface {
  id: number,
  title_en?: string,
  title_ru?: string
  description_en?: string,
  description_ru?: string
  title?: string
  description?: string
  access: LicenseAccess,
  mature_content: boolean,
  copyright_content: boolean,
  created_at: DateTime,
  updated_at: DateTime,
}
