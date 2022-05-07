import { DateTime } from 'luxon'

export type ModelFormat = '3ds_max' | 'maya' | 'blender' | 'cinema4d' | 'unity' | 'unreal_engine'
export type ModelRenderer = 'v-ray' | 'mental_ray' | 'arnold' | 'redshift' | 'cycles' | 'corona' | 'unity'
| 'unreal_engine'
export type ModelHairSystem = 'standard' | 'ornatrix' | 'xgen' | 'hairfarm' | 'yeti'
export type ModelTextures = 'procedural' | 'pbr' | 'npr'
export type ModelTexturesWrapping = 'generated' | 'unwrap_uvw' | 'udim' | 'uvtile'
export type ModelRigging = 'bones' | 'autodesk_cat'
export type ModelGeometry = 'tris' | 'quads' | 'ngons' | 'combined'

export interface ModelImage {
  original: string,
  slide: string,
  thumbnail: string
}

export interface ModelInstallPath {
  models: string,
  textures: string
}

export interface ModelSimple {
  id: number,
  slug: string,
  title_en?: string,
  title_ru?: string
  title?: string
  mature_content: boolean,
  thumbnail: string,
  category: string,
  status?: number,
  created_at: DateTime,
  updated_at: DateTime,
}

export interface ModelFull {
  id: number,
  slug: string,
  status?: number,
  mature_content: boolean,
  title_en?: string,
  title_ru?: string
  description_en?: string,
  description_ru?: string
  tags_en?: string[],
  tags_ru?: string[],
  title?: string,
  description?: string,
  tags?: string[]
  brands: string[],
  thumbnail: string,
  install_paths: ModelInstallPath,
  images: string[],
  preview: string[] | null,
  category: number,
  collections: string[],
  created_at: DateTime,
  updated_at: DateTime,
}

export interface ModelContract {
  pagination: PaginationContract,
  items: ModelSimple[]
}
