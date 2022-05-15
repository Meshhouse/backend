import { DateTime } from 'luxon'

export type CategoryFilterType = 'radio' | 'checkbox' | 'checkbox-color' | 'range'

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

export interface CategoryFilter {
  id: number,
  category: number | null,
  order: number,
  key: string,
  localized: boolean,
  type: CategoryFilterType,
  querystring_alias: string,
  value_delimeter: string | null,
  values: any[],
  title?: string,
  title_en?: string,
  title_ru?: string,
}
