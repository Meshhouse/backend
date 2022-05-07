export type BlockType = 'integrations' |
'featured_categories' |
'courtesy_slider' |
'site_supporters' |
'site_patrons'

export const BlockTypeEnums: BlockType[] = [
  'courtesy_slider',
  'featured_categories',
  'integrations',
  'site_supporters',
  'site_patrons',
]

export type BlockPayloadContent = Integration[] |
FeaturedCategory[] |
IndexPageCourtesySlide[] |
SiteSupporter[] |
SitePatron[]

type BlockParams = Integration |
FeaturedCategory |
IndexPageCourtesySlide |
SiteSupporter |
SitePatron

export interface Integration {
  title: string,
  url: string,
  logo: string,
  params: {
    auth: boolean,
    filters: boolean,
    purchase: boolean,
    download: boolean,
    custom_install: boolean
  }
}

export interface FeaturedCategory {
  title_en: string,
  title_ru: string,
  thumbnail: string,
  tag: string,
  category_slug: string
}

export interface IndexPageCourtesySlide {
  title_en: string,
  title_ru: string,
  description_en: string,
  description_ru: string,
  background: string,
  courtesy: string,
}

export interface SiteSupporter {
  title: string,
  logo: string,
  url: string
}

export interface SitePatron {
  title: string,
  level: string,
}

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
