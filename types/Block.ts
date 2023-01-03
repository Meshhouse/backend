import type {
  BlockType,
  BlockParams,
  Integration,
  FeaturedCategory,
  IndexPageCourtesySlide,
  SiteSupporter,
  SitePatron,
  SharedCategoryFilter,
} from '@meshhouse/types'

export const BlockTypeEnums: BlockType[] = [
  'courtesy_slider',
  'featured_categories',
  'integrations',
  'site_supporters',
  'site_patrons',
  'category_filters',
]

export function isIntegration (block: BlockParams): block is Integration {
  return (block as Integration).params !== undefined
}

export function isFeaturedCategory (block: BlockParams): block is FeaturedCategory {
  return (block as FeaturedCategory).category_slug !== undefined
}

export function isCourtesySlide (block: BlockParams): block is IndexPageCourtesySlide {
  return (block as IndexPageCourtesySlide).courtesy !== undefined
}

export function isSiteSupporter (block: BlockParams): block is SiteSupporter {
  return (block as SiteSupporter).logo !== undefined &&
    (block as SiteSupporter).url !== undefined
}

export function isSitePatron (block: BlockParams): block is SitePatron {
  return (block as SitePatron).level !== undefined
}

export function isSharedCategoryFilter (block: BlockParams): block is SharedCategoryFilter {
  return (block as SharedCategoryFilter).querystring_alias !== undefined
}
