import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type {
  ModelRigging,
  ModelHairSystem, ModelTextures,
  ModelTexturesWrapping,
  ModelFormat,
  ModelRenderer,
} from '@meshhouse/types'

export default class CreateModelValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    slug: schema.string(),
    mature_content: schema.boolean(),
    status: schema.number(),
    brands: schema.array().members(schema.string()),
    licenses: schema.array().members(schema.number()),
    install_paths: schema.object().members({
      models: schema.string(),
      textures: schema.string(),
    }),
    textures_link: schema.string.optional(),
    textures_link_size: schema.number(),
    thumbnail: schema.string(),
    images: schema.array.optional().members(schema.object().members({
      original: schema.string(),
      slide: schema.string(),
      thumbnail: schema.string(),
    })),
    preview: schema.string.optional(),
    category: schema.number(),
    title_en: schema.string(),
    title_ru: schema.string(),
    description_en: schema.string.optional(),
    description_ru: schema.string.optional(),
    tags_en: schema.array.optional().members(schema.string()),
    tags_ru: schema.array.optional().members(schema.string()),

    properties: schema.object().members({
      polygons: schema.number(),
      vertices: schema.number(),
      blendshapes: schema.boolean(),
      rig: schema.enum<(boolean | ModelRigging)[]>(
        [false, 'bones', 'autodesk_cat']
      ),
      hair_system: schema.enum<(boolean | ModelHairSystem)[]>(
        [false, 'standard', 'ornatrix', 'xgen', 'hairfarm', 'yeti']
      ),
      textures: schema.enum<(boolean | ModelTextures)[]>(
        [false, 'procedural', 'pbr', 'npr']
      ),
      uv: schema.enum<(boolean | ModelTexturesWrapping)[]>(
        [false, 'generated', 'unwrap_uvw', 'udim', 'uvtile']
      ),
    }),
    files: schema.array().members(schema.object().members({
      url: schema.string(),
      program: schema.enum<ModelFormat[]>(
        ['3ds_max', 'maya', 'blender', 'cinema4d', 'unity', 'unreal_engine']
      ),
      program_version: schema.string(),
      renderer: schema.enum<ModelRenderer[]>(
        ['v-ray', 'mental_ray', 'arnold', 'redshift', 'cycles', 'corona', 'unity', 'unreal_engine']
      ),
      renderer_version: schema.string(),
      size: schema.number(),
    })),
    collections: schema.array.optional().members(schema.number()),
  })

  public messages = {}
}
