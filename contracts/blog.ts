import { DateTime } from 'luxon'

export interface BlogSimple {
  id: number,
  slug: string,
  title_en?: string,
  title_ru?: string
  title?: string,
  thumbnail: string | null,
  excerpt_en?: string,
  excerpt_ru?: string,
  excerpt?: string,
  created_at: DateTime,
  updated_at: DateTime,
}

export interface BlogFull {
  id: number,
  slug: string,
  title_en?: string,
  title_ru?: string
  title?: string,
  thumbnail: string | null,
  excerpt_en?: string,
  excerpt_ru?: string,
  excerpt?: string,
  content_en?: string,
  content_ru?: string,
  content?: string,
  created_at: DateTime,
  updated_at: DateTime,
}
