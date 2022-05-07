import { DateTime } from 'luxon'

export interface CategoryModel {
  id: number,
  slug: string,
  icon: string,
  parent_id: number | null,
  title_en?: string,
  title_ru?: string
  description_en?: string,
  description_ru?: string
  title?: string
  description?: string
  childrens?: CategoryModel[]
  created_at: DateTime,
  updated_at: DateTime,
}

export interface CategoryContract {
  pagination: PaginationContract,
  items: CategoryModel[]
}
