import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { schema } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs/promises'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'

export default class UploadsController {
  private UPLOAD_TYPES = [
    'integration',
    'thumbnail',
    'model_image',
    'model_3d_preview',
    'courtesy',
    'featured_category',
    'post_thumbnail',
    'site_supporter',
  ]

  public async upload (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      type: schema.enum(this.UPLOAD_TYPES),
      /*binary: schema.file({
        extnames: ['jpg', 'png', 'webp', 'av1', 'svg', 'gltf', 'glb', 'zip', 'rar', '7z'],
      }),*/
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
        const result = await this.makeModelImage(payload.binary, payload.filename)
        return result
      }
      case 'thumbnail': {
        const result = await this.makeModelPreviewImage(payload.binary)
        return result
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
        const backblaze = Drive.use('backblaze')
        const uploadedFile = await fs.readFile(payload.binary.tmpPath)

        let fullPath = `${payload.path}${payload.binary.clientName}`
        if (payload.path[0] === '/') {
          fullPath = fullPath.substring(1)
        }

        await backblaze.put(fullPath, uploadedFile, {
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
  /**
   * Generates and saves model image and thumbnail
   * @param binary file
   * @param filename file name or id
   * @returns upload result or error
   */
  private async makeModelImage (binary: MultipartFileContract, filename ?: string) {
    try {
      // Generate unique id
      const uniqueId = !filename ? uuidv4() : filename

      if (binary.tmpPath) {
        const uploadedFile = await fs.readFile(binary.tmpPath)
        const watermark = await fs.readFile(Application.tmpPath('watermark_full.png'))

        const originalMetadata = await sharp(uploadedFile).metadata()

        const slideBuffer = await sharp(uploadedFile).resize({ width: undefined, height: 1080 }).toBuffer()
        const slideBufferMetadata = await sharp(slideBuffer).metadata()

        const watermarkSlideBuffer = await sharp(watermark)
          .resize({ width: slideBufferMetadata.width, height: slideBufferMetadata.height })
          .png()
          .toBuffer()

        const promises = [
          sharp(uploadedFile)
            .resize({ width: undefined, height: 1080 })
            .sharpen()
            .composite([{
              input: watermarkSlideBuffer,
            }])
            .webp({ quality: 90, reductionEffort: 6 })
            .toBuffer(),
          sharp(uploadedFile)
            .resize({ width: 360, height: 180 })
            .webp({ quality: 75, reductionEffort: 6 })
            .toBuffer(),
        ]

        if ((originalMetadata.height || 0) > 1080) {
          const watermarkOriginalBuffer = await sharp(watermark)
            .resize({ width: originalMetadata.width, height: originalMetadata.height })
            .png()
            .toBuffer()

          promises.push(sharp(uploadedFile)
            .composite([{
              input: watermarkOriginalBuffer,
            }])
            .webp({ quality: 95, reductionEffort: 6 })
            .toBuffer()
          )
        }

        const results = await Promise.all(promises)

        const slideImageBuffer = results[0]
        const thumbnailBuffer = results[1]

        let originalBuffer: Buffer | null = null

        if ((originalMetadata.height || 0) > 1080) {
          originalBuffer = results[2]
        }

        await Promise.all([
          Drive.put(`./images/model-${uniqueId}.webp`, slideImageBuffer),
          Drive.put(`./images/thumbnails/thumbnail-${uniqueId}.webp`, thumbnailBuffer),
          originalBuffer ? Drive.put(`./images/originals/model-${uniqueId}.webp`, originalBuffer) : undefined,
        ])

        const urlPromises = await Promise.all([
          Drive.getUrl(`images/model-${uniqueId}.webp`),
          Drive.getUrl(`images/thumbnails/thumbnail-${uniqueId}.webp`),
          originalBuffer ? Drive.getUrl(`/images/originals/model-${uniqueId}.webp`) : undefined,
        ])

        return {
          original: originalBuffer ? urlPromises[2] : urlPromises[0],
          slide: urlPromises[0],
          thumbnail: urlPromises[1],
        }
      } else {
        throw new Error('upload failed')
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  /**
   * Generates and saves model preview image
   * @param binary file
   * @returns upload result or error
   */
  private async makeModelPreviewImage (binary: MultipartFileContract) {
    try {
      // Generate unique id
      const uniqueId = uuidv4()

      if (binary.tmpPath) {
        const uploadedFile = await fs.readFile(binary.tmpPath)
        const watermark = await fs.readFile(Application.tmpPath('watermark_full.png'))

        const watermarkSlideBuffer = await sharp(watermark)
          .resize({ width: 1024, height: 1024 })
          .png()
          .toBuffer()

        const buffer = await sharp(uploadedFile)
          .resize({ width: 1024, height: 1024 })
          .sharpen()
          .composite([{
            input: watermarkSlideBuffer,
          }])
          .webp({ quality: 85, reductionEffort: 6 })
          .toBuffer()

        await Drive.put(`./images/previews/model-${uniqueId}.webp`, buffer)
        const url = await Drive.getUrl(`images/previews/model-${uniqueId}.webp`)

        return {
          url,
        }
      } else {
        throw new Error('upload failed')
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}
