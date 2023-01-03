import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { ImageInterface } from 'Contracts/interfaces'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs/promises'
import sharp, { Sharp } from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'
import { URL } from 'node:url'

export default class ImageService implements ImageInterface {
  public translateDomain (url: string): string {
    const base = new URL(url)

    return `${Env.get('API_URL')}${base.pathname}`
  }

  public async makeModelImage (binary: MultipartFileContract, filename ?: string) {
    try {
      // Generate unique id
      const uniqueId = !filename ? uuidv4() : filename

      if (binary.tmpPath) {
        const uploadedFile = await fs.readFile(binary.tmpPath)
        const watermark = await fs.readFile(Application.tmpPath('watermark_full.png'))

        const originalMetadata = await sharp(uploadedFile).metadata()

        const slideBuffer = await sharp(uploadedFile).resize({ width: undefined, height: 1080 }).toBuffer()
        const slideBufferMetadata = await sharp(slideBuffer).metadata()

        const overlayComposite = await this.calculateWatermarkOpacity(uploadedFile)
        const watermarkSlideBuffer = await sharp(watermark)
          .resize({ width: slideBufferMetadata.width, height: slideBufferMetadata.height })
          .composite(overlayComposite)
          .png()
          .toBuffer()

        const promises = [
          sharp(uploadedFile)
            .resize({ width: undefined, height: 1080 })
            .sharpen()
            .composite([{
              input: watermarkSlideBuffer,
            }])
            .median()
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
            .composite(overlayComposite)
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
          originalBuffer ? Drive.getUrl(`images/originals/model-${uniqueId}.webp`) : undefined,
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

  public async makeModelPreviewImage (binary: MultipartFileContract, filename?: string) {
    try {
      // Generate unique id
      const uniqueId = !filename ? uuidv4() : filename

      if (binary.tmpPath) {
        const uploadedFile = await fs.readFile(binary.tmpPath)
        const watermark = await fs.readFile(Application.tmpPath('watermark_full.png'))

        const overlayComposite = await this.calculateWatermarkOpacity(uploadedFile)
        const watermarkSlideBuffer = await sharp(watermark)
          .resize({ width: 1024, height: 1024 })
          .composite(overlayComposite)
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
  /**
   * Calculates watermark opacity, based on provided image
   * @param srcFile source file
   * @returns sharp overlay option
   */
  private async calculateWatermarkOpacity (srcFile: Buffer): Promise<sharp.OverlayOptions[]> {
    // Geting average image intensity
    const averageColor = (await sharp(srcFile)
      .resize({ width: 64, height: 64, fit: 'fill' })
      .blur(128)
      .resize({ width: 1, height: 1, fit: 'fill' })
      .greyscale()
      .toColorspace('b-w')
      .raw()
      .toBuffer())[0]

    // Calculating watermark opacity, based on avg image intensity
    const watermarkOpacity = averageColor <= 127
      ? Math.round((averageColor * 0.1))
      : Math.round((averageColor * 0.15))

    return [{
      input: Buffer.from([255, 255, 255, watermarkOpacity]),
      raw: {
        width: 1,
        height: 1,
        channels: 4,
      },
      tile: true,
      blend: 'dest-in',
    }]
  }
}
