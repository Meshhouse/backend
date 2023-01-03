import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Model from 'App/Models/Model'
import type {
  ModelFormat,
} from '@meshhouse/types'

export default class SeosController {
  public async modelSEO (ctx: HttpContextContract) {
    try {
      const validateSchema = schema.create({
        params: schema
          .object()
          .members({
            slug: schema.string(),
          }),
      })
      const headersValidateSchema = schema.create({
        'x-meshhouse-language': schema.string({}, [rules.language()]),
      })

      const payload = await ctx.request.validate({ schema: validateSchema })
      const headers = await validator.validate({
        schema: headersValidateSchema,
        data: ctx.request.headers(),
      })

      const language = headers['x-meshhouse-language'] ?? null

      const model = await Model
        .query()
        .preload('collections', (collectionsQuery) => {
          collectionsQuery.preload('locales')
        })
        .preload('category', (categoryQuery) => {
          categoryQuery.preload('locales')
        })
        .preload('locales', (localesQuery) => {
          localesQuery.select('rowid', '*')
        })
        .preload('filters')
        .preload('properties')
        .preload('files')
        .select('*')
        .where({ slug: payload.params.slug })
        .firstOrFail()

      const serialized = model.serialize()

      const tags = {
        og: {
          'og:title': '',
          'og:type': 'product',
          'og:description': '',
          'og:image': model.thumbnail,
          'og:image:width': '512',
          'og:image:height': '512',
          'og:site_name': 'MeshHouse',
          'og:availability': 'instock',
          'product:price:amount': '0',
          'product:price:currency': 'USD',
        },
        meta: {
          name: '',
          description: '',
          image: model.thumbnail,
          sku: `MSH-${model.id}`,
        },
        title: '',
        description: '',
      }

      const formats = Array.from(new Set(serialized.files.map((file) => file.program)))
        .map((format: ModelFormat) => {
          switch (format) {
            case 'maya': {
              return 'Maya'
            }
            case 'blender': {
              return 'Blender'
            }
            case 'cinema4d': {
              return 'Cinema 4D'
            }
            case 'unity': {
              return 'Unity'
            }
            case 'unreal_engine': {
              return 'Unreal Engine'
            }
            default: {
              return '3ds Max'
            }
          }
        })

      switch (language) {
        case 'ru': {
          tags.og['og:title'] = `${serialized.locales.title_ru} - 3D модель`
          tags.og['og:description'] = `Модель доступна для скачивания в форматах ${formats}. Посетите MeshHouse чтобы получить бесплатные 3D модели`
          tags.meta.name = `${serialized.locales.title_ru} - 3D модель`
          tags.meta.description = `Модель доступна для скачивания в форматах ${formats}. Посетите MeshHouse чтобы получить бесплатные 3D модели`
          tags.title = `${serialized.locales.title_ru} 3D модель`
          tags.description = `3D модель ${serialized.locales.title_ru} ${serialized.locales.tags_ru}, доступные форматы ${formats}, готова для 3D анимации и других 3D проектов`

          break
        }
        default: {
          tags.og['og:title'] = `${serialized.locales.title_en} - 3D model`
          tags.og['og:description'] = `Model available for download in formats ${formats}. Visit MeshHouse to get free 3D models`
          tags.meta.name = `${serialized.locales.title_en} - 3D model`
          tags.meta.description = `Model available for download in formats ${formats}. Visit MeshHouse to get free 3D models`
          tags.title = `${serialized.locales.title_en} 3D model`
          tags.description = `3D model ${serialized.locales.title_en} ${serialized.locales.tags_en}, formats include ${formats}, ready for 3D animation and other 3D projects`
        }
      }

      return tags
    } catch (error) {
      console.error(error)
      return ctx.response.badRequest(error)
    }
  }
}
