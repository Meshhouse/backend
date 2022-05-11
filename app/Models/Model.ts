import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import ModelProperty from 'App/Models/ModelProperty'
import ModelLocalization from 'App/Models/ModelLocalization'
import ModelFile from 'App/Models/ModelFile'
import Collection from 'App/Models/Collection'
import ModelCategoryFilter from 'App/Models/ModelCategoryFilter'
import { ModelImage, ModelInstallPath } from 'Contracts/Model'

export default class Model extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @manyToMany(() => Category, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'model_id',
    pivotRelatedForeignKey: 'category_id',
  })
  public category: ManyToMany<typeof Category>

  @hasOne(() => ModelProperty,{
    foreignKey: 'id',
  })
  public properties: HasOne<typeof ModelProperty>

  @hasOne(() => ModelLocalization, {
    foreignKey: 'rowid',
  })
  public locales: HasOne<typeof ModelLocalization>

  @hasMany(() => ModelFile, {
    foreignKey: 'modelId',
  })
  public files: HasMany<typeof ModelFile>

  @column({
    prepare: (value: boolean) => {
      return value ? 1 : 0
    },
    consume: (value: number) => {
      return Boolean(value)
    },
  })
  public matureContent: boolean

  @column()
  public status: number

  @column()
  public brands: string[]

  @column({
    prepare: (value: ModelInstallPath) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      try {
        const json = JSON.parse(value)
        return json
      } catch (error) {
        return value
      }
    },
  })
  public installPaths: ModelInstallPath

  @column()
  public texturesLink: string

  @column()
  public texturesLinkSize: number

  @column()
  public thumbnail: string

  @column({
    prepare: (value: ModelImage[]) => {
      return JSON.stringify(value)
    },
    consume: (value: string) => {
      try {
        const json = JSON.parse(value)
        return json
      } catch (error) {
        return value
      }
    },
  })
  public images: ModelImage[]

  @column()
  public licenses: number[]

  @column()
  public preview: string | null

  @manyToMany(() => Collection, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'model_id',
    pivotRelatedForeignKey: 'collection_id',
    pivotTable: 'collection_models',
  })
  public collections: ManyToMany<typeof Collection>

  @hasMany(() => ModelCategoryFilter, {
    foreignKey: 'modelId',
  })
  public filters: HasMany<typeof ModelCategoryFilter>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
