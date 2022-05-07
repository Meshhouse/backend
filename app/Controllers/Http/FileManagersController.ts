import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'
import fs from 'fs/promises'
import path from 'path'
import fileType from 'file-type'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import S3 from 'aws-sdk/clients/s3'

export default class FileManagersController {
  private mimesList = {
    'webp': 'image/webp',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'svg': 'image/svg+xml',
  }

  /**
   * Get list of folders/files in directory
   * @param ctx context
   * @returns list of folders/files in directory
   */
  public async list (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      path: schema.string.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')
    const path = payload.path ? `uploads${payload.path}` : 'uploads'

    const files = await fs.readdir(Application.tmpPath(path), { withFileTypes: true })
    const fileObjects: any[] = []

    for (const file of files) {
      let fileTypeObj
      const fsStats = await fs.stat(Application.tmpPath(`${path}/${file.name}`))

      if (!file.isDirectory()) {
        fileTypeObj = await fileType.fromFile(Application.tmpPath(`${path}/${file.name}`))
      }

      const createdAt = DateTime.fromMillis(fsStats.ctimeMs).toISO()
      const updatedAt = DateTime.fromMillis(fsStats.mtimeMs).toISO()

      fileObjects.push({
        name: file.name,
        type: file.isDirectory() ? 'directory' : 'file',
        mime: fileTypeObj ? fileTypeObj.mime : null,
        size: fsStats.size,
        created_at: createdAt,
        updated_at: updatedAt,
      })
    }

    return fileObjects
  }
  /**
   * Delete file in directory
   * @param ctx context
   * @returns is deleted
   */
  public async delete (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      path: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')
    const uploadPath = `uploads/${payload.path}`

    const normalizedPath = path.normalize(uploadPath)

    try {
      await fs.access(Application.tmpPath(normalizedPath))
      await fs.rm(Application.tmpPath(normalizedPath))

      return true
    } catch (error) {
      throw error
    }
  }
  /**
   * Get list of folders/files in S3 bucket
   * @param ctx context
   * @returns list of folders/files in S3 bucket
   */
  public async listS3 (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      path: schema.string.optional(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    const s3 = new S3({
      accessKeyId: Env.get('S3_KEY'),
      secretAccessKey: Env.get('S3_SECRET'),
      endpoint: Env.get('S3_ENDPOINT'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
      httpOptions: { timeout: 0 },
    })

    const objectsResponse = await s3.listObjectsV2({
      Bucket: 'meshhouse',
      Prefix: payload.path || '',
      Delimiter: '/',
    }).promise()

    const objects: any[] = []

    let sanitizedPath = ''

    if (payload.path) {
      sanitizedPath = payload.path[0] === '/'
        ? payload.path.substring(1)
        : payload.path
    }

    if (objectsResponse.CommonPrefixes) {
      objectsResponse.CommonPrefixes.map((prefix) => {
        const name = payload.path
          ? String(prefix.Prefix).replace(sanitizedPath, '').replace('/', '')
          : String(prefix.Prefix).replace('/', '')

        objects.push({
          name,
          type: 'directory',
          mime: null,
          size: 0,
          created_at: 0,
          updated_at: 0,
        })
      })
    }

    if (objectsResponse.Contents) {
      objectsResponse.Contents
        .filter((obj) => !obj.Key?.includes('.file_placeholder'))
        .map((obj) => {
          const name = payload.path
            ? String(obj.Key).replace(sanitizedPath, '')
            : String(obj.Key)

          const extension = name.split('.')[1] || ''

          objects.push({
            name,
            type: 'file',
            full_path: String(obj.Key),
            mime: this.mimesList[extension] || null,
            size: obj.Size,
            created_at: obj.LastModified,
            updated_at: obj.LastModified,
          })
        })
    }

    return objects
  }
  /**
   * Delete file in S3 bucket
   * @param ctx context
   * @returns is deleted
   */
  public async deleteS3 (ctx: HttpContextContract) {
    const validateSchema = schema.create({
      path: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: validateSchema })
    await ctx.bouncer.authorize('viewAdmin')

    try {
      const backblaze = Drive.use('backblaze')
      await backblaze.delete(payload.path)

      return true
    } catch (error) {
      throw error
    }
  }
}
