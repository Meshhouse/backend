import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Model from 'App/Models/Model'
import CategoryFilter from 'App/Models/CategoryFilter'

export default class ModelCategoryFilter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public modelId: number

  @column()
  public filterId: number

  @column()
  public value: unknown

  @belongsTo(() => Model, {
    localKey: 'modelId',
    foreignKey: 'id',
  })
  public model: BelongsTo<typeof Model>

  @belongsTo(() => CategoryFilter, {
    localKey: 'modelId',
    foreignKey: 'id',
  })
  public categoryFilter: BelongsTo<typeof CategoryFilter>
}
