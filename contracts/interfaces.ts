import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import type {
  ImageUploadOutput,
  ImagePreviewOutput,
} from 'types'

export interface ImageInterface {
  /**
   * Modifies original hostname to target hostname (sets in Env)
   * @param url url
   * @returns url with new hostname
   */
  translateDomain(url: string): string
  /**
   * Generates and saves model image and thumbnail
   * @param binary file
   * @param filename file name or id
   * @returns upload result or error
   */
  makeModelImage(binary: MultipartFileContract, filename ?: string): Promise<ImageUploadOutput|Error>
  /**
   * Generates and saves model preview image
   * @param binary file
   * @returns upload result or error
   */
  makeModelPreviewImage(binary: MultipartFileContract): Promise<ImagePreviewOutput|Error>
}

export interface LensInterface {
  modifyQuery(query: ModelQueryBuilderContract<any>): ModelQueryBuilderContract<any>
  validate(): boolean
}

export interface CrayaExportInterface {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  formats: string[];
  tags: string[];
  url: string;
  provider: string;
  mature_content: boolean;
  price: number;
}

export interface GithubRelease {
  url: string;
  id: number;
  node_id: string;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  assets: {
    url: string;
    browser_download_url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    state: string;
    size: number;
  }[];
}
