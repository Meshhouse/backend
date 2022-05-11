import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type {
  ModelRigging,
  ModelHairSystem, ModelTextures,
  ModelTexturesWrapping,
  ModelFormat,
  ModelRenderer,
} from 'Contracts/Model'

export default class ListModelValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    page: schema.number.optional(),
    count: schema.number.optional(),
    filters: schema.object.optional().members({
      formats: schema.array.optional().members(schema.object().members({
        program: schema.enum<ModelFormat[]>(
          ['3ds_max', 'maya', 'blender', 'cinema4d', 'unity', 'unreal_engine']
        ),
        program_version: schema.string(),
      })),
      renderers: schema.array.optional().members(schema.object().members({
        renderer: schema.enum<ModelRenderer[]>(
          ['v-ray', 'mental_ray', 'arnold', 'redshift', 'cycles', 'corona', 'unity', 'unreal_engine']
        ),
        renderer_version: schema.string.optional(),
      })),
      polys: schema.enum.optional<string[]>(
        ['low-poly', 'mid-poly', 'hi-poly']
      ),
      rig: schema.enum.optional<(ModelRigging)[]>(
        ['bones', 'autodesk_cat']
      ),
      hair_system: schema.enum.optional<(ModelHairSystem)[]>(
        ['standard', 'ornatrix', 'xgen', 'hairfarm', 'yeti']
      ),
      textures: schema.enum.optional<(ModelTextures)[]>(
        ['procedural', 'pbr', 'npr']
      ),
      uv: schema.enum.optional<(ModelTexturesWrapping)[]>(
        ['generated', 'unwrap_uvw', 'udim', 'uvtile']
      ),
    }),
    query: schema.string.optional(),
  })

  public messages = {}
}
