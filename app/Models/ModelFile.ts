import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import type { ModelFormat, ModelRenderer } from 'Contracts/Model'

export default class ModelFile extends BaseModel {
  public static table = 'model_files'

  @column({ isPrimary: true })
  public id: number

  @column()
  public modelId: number

  @column()
  public url: string

  @column()
  public program: ModelFormat

  @column()
  public programVersion: string

  @column()
  public renderer: ModelRenderer

  @column()
  public rendererVersion: string
}
