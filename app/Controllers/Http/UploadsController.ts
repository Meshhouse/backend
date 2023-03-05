import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { inject } from '@adonisjs/fold'
import ImageService from 'App/Services/ImageService'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs/promises'

@inject()
export default class UploadsController {
  constructor (public ImageService: ImageService) {}

  private UPLOAD_TYPES = [
    'integration',
    'thumbnail',
    'model_image',
    'model_3d_preview',
    'courtesy',
    'featured_category',
    'post_thumbnail',
    'site_supporter',
    'banner',
  ]

  public async upload (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      type: schema.enum(this.UPLOAD_TYPES),
      binary: schema.file(),
      filename: schema.string.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    switch (payload.type) {
      case 'integration': {
        await payload.binary.moveToDisk('./integrations')
        return await Drive.getUrl(`integrations/${payload.binary.fileName}`)
      }
      case 'model_image': {
        return await this.ImageService.makeModelImage(payload.binary, payload.filename)
      }
      case 'thumbnail': {
        return await this.ImageService.makeModelPreviewImage(payload.binary, payload.filename)
      }
      case 'model_3d_preview': {
        await payload.binary.moveToDisk('./previews')
        return await Drive.getUrl(`previews/${payload.binary.fileName}`)
      }
      case 'courtesy': {
        await payload.binary.moveToDisk('./courtesy')
        return await Drive.getUrl(`courtesy/${payload.binary.fileName}`)
      }
      case 'featured_category': {
        await payload.binary.moveToDisk('./featured-categories')
        return await Drive.getUrl(`featured-categories/${payload.binary.fileName}`)
      }
      case 'post_thumbnail': {
        await payload.binary.moveToDisk('./post-thumbnails')
        return await Drive.getUrl(`post-thumbnails/${payload.binary.fileName}`)
      }
      case 'site_supporter': {
        await payload.binary.moveToDisk('./site-supporters')
        return await Drive.getUrl(`site-supporters/${payload.binary.fileName}`)
      }
      case 'banner': {
        return await this.ImageService.makeBannerImage(payload.binary, payload.filename)
      }
      default: {
        return ctx.response.unprocessableEntity('upload type is invalid')
      }
    }
  }
  /**
   * Uploads file to S3 storage
   * @param ctx context
   * @returns upload result or error
   */
  public async uploadToS3 (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      binary: schema.file(),
      path: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    if (payload.binary.tmpPath) {
      try {
        const s3 = Drive.use('s3')
        const uploadedFile = await fs.readFile(payload.binary.tmpPath)

        let fullPath = `${payload.path}${payload.binary.clientName}`
        if (payload.path[0] === '/') {
          fullPath = fullPath.substring(1)
        }

        await s3.put(fullPath, uploadedFile, {
          contentType: payload.binary.headers['content-type'],
          contentDisposition: payload.binary.headers['content-disposition'],
        })

        const url = Env.get('S3_URL_PATH') + `${payload.path}${payload.binary.clientName}`

        return {
          url,
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
