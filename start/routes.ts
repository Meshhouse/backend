import Route from '@ioc:Adonis/Core/Route'

// Public API v1
Route.group(() => {
  Route.group(() => {
    Route.get('/categories', 'CategoriesController.list')
    Route.get('/category-tree', 'CategoriesController.tree')
    Route.get('/categories/:id', 'CategoriesController.single').where('id', /^[0-9]+$/)
    Route.get('/categories/:id/filters', 'CategoriesController.listFilters')

    Route.post('/models', 'ModelsController.list')
    Route.post('/models/collection', 'ModelsController.listCollection')
    Route.get('/models/:slug', 'ModelsController.single')

    Route.get('/blocks', 'BlocksController.list')
    Route.get('/blocks/:type', 'BlocksController.single')

    Route.get('/posts', 'BlogsController.list')
    Route.get('/posts/:slug', 'BlogsController.single')

    Route.get('/licenses', 'LicensesController.list')

    Route.get('/autocomplete', 'SearchesController.autocomplete')

    Route.post('/statistics/models', 'StatisticsController.modelStatistics')
    Route.post('/statistics/model-single', 'StatisticsController.singleModelStatistics')
  }).prefix('/v1')
}).prefix('api')
  .middleware('auth:api')
  .middleware('throttle:api')

// Private API
Route.group(() => {
  // Semi-public routes for auth
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.post('/refresh', 'AuthController.refresh')
    Route.post('/verify-email', 'AuthController.verifyEmail')
    Route.post('/reset-password', 'AuthController.startResetPassword')
    Route.post('/reset-password-confirm', 'AuthController.resetPassword')
  }).prefix('req')
})

// Private API
Route.group(() => {
  // Semi-public routes
  Route.group(() => {
    Route.get('/categories', 'CategoriesController.list')
    Route.get('/category-tree', 'CategoriesController.tree')
    Route.get('/categories/:id', 'CategoriesController.single').where('id', /^[0-9]+$/)
    Route.get('/categories/:id/filters', 'CategoriesController.listFilters')

    Route.post('/models', 'ModelsController.list')
    Route.post('/models/collection', 'ModelsController.listCollection')
    Route.post('/models/favorites', 'ModelsController.listFavorites')
    Route.get('/models/:slug', 'ModelsController.single')

    Route.get('/blocks', 'BlocksController.list')
    Route.get('/blocks/:type', 'BlocksController.single')

    Route.get('/posts', 'BlogsController.list')
    Route.get('/posts/:slug', 'BlogsController.single')

    Route.get('/licenses', 'LicensesController.list')
    Route.get('/licenses/:id', 'LicensesController.single').where('id', /^[0-9]+$/)

    Route.get('/autocomplete', 'SearchesController.autocomplete')

    Route.get('/pages/application', 'StaticPagesController.applicationPC')
    Route.get('/pages/index/stats', 'ModelsController.statistics')
    Route.get('/pages/static/:slug', 'StaticPagesController.get')

    Route.get('/seo/models/:slug', 'SeosController.modelSEO')
    Route.get('/localization', 'LocalizationsController.get')

    Route.post('/statistics/models', 'StatisticsController.modelStatistics')
    Route.post('/statistics/model-single', 'StatisticsController.singleModelStatistics')
    Route.put('/statistics/models/like', 'StatisticsController.like')
    Route.put('/statistics/models/view', 'StatisticsController.viewModel')
    Route.put('/statistics/models/download', 'StatisticsController.downloadModel')
  })
  // Admin only or Authorized users routes
  Route.group(() => {
    Route.get('/collections', 'CollectionsController.list')
    Route.put('/collections', 'CollectionsController.create')
    Route.patch('/collections', 'CollectionsController.update')
    Route.delete('/collections', 'CollectionsController.delete')

    Route.put('/categories', 'CategoriesController.create')
    Route.patch('/categories', 'CategoriesController.update')
    Route.delete('/categories', 'CategoriesController.delete')

    Route.get('/categories/filters', 'CategoryFiltersController.list')
    Route.put('/categories/filters', 'CategoryFiltersController.create')
    Route.patch('/categories/filters', 'CategoryFiltersController.update')
    Route.delete('/categories/filters', 'CategoryFiltersController.delete')

    Route.post('/models-admin', 'ModelsController.listAdminPanel')
    Route.put('/models', 'ModelsController.create')
    Route.patch('/models', 'ModelsController.update')
    Route.delete('/models', 'ModelsController.delete')

    Route.put('/blocks', 'BlocksController.create')
    Route.patch('/blocks', 'BlocksController.update')
    Route.delete('/blocks', 'BlocksController.delete')

    Route.post('/pages/static', 'StaticPagesController.list')
    Route.put('/pages/static', 'StaticPagesController.create')
    Route.patch('/pages/static', 'StaticPagesController.update')
    Route.delete('/pages/static', 'StaticPagesController.delete')

    Route.get('/subscriptions', 'SubscriptionsController.list')
    Route.get('/subscriptions/:id', 'SubscriptionsController.single')
    Route.put('/subscriptions', 'SubscriptionsController.create')
    Route.patch('/subscriptions', 'SubscriptionsController.update')
    Route.delete('/subscriptions', 'SubscriptionsController.delete')
    Route.post('/subscriptions/sync', 'SubscriptionsController.sync')

    Route.post('/subscribers', 'SubscriptionsController.listSubscribers')
    Route.get('/subscribers/stats', 'SubscriptionsController.adminStats')

    Route.get('/localization-admin', 'LocalizationsController.listAdmin')
    Route.post('/localization-admin', 'LocalizationsController.update')

    Route.put('/posts', 'BlogsController.create')
    Route.patch('/posts', 'BlogsController.update')
    Route.delete('/posts', 'BlogsController.delete')

    Route.put('/licenses', 'LicensesController.create')
    Route.patch('/licenses', 'LicensesController.update')
    Route.delete('/licenses', 'LicensesController.delete')

    Route.post('/upload', 'UploadsController.upload')
    Route.post('/upload-s3', 'UploadsController.uploadToS3')

    Route.post('/fs', 'FileManagersController.list')
    Route.delete('/fs', 'FileManagersController.delete')

    Route.post('/fs-s3', 'FileManagersController.listS3')
    Route.delete('/fs-s3', 'FileManagersController.deleteS3')

    Route.get('/profile', 'AuthController.profile')
    Route.post('/logout', 'AuthController.logout')

    Route.get('/users', 'AuthController.list')
    Route.get('/users/:id', 'AuthController.single').where('id', /^[0-9]+$/)
    Route.put('/users', 'AuthController.create')
    Route.patch('/users', 'AuthController.update')
    Route.delete('/users', 'AuthController.deleteUser')

    Route.post('/api-keys', 'AuthController.listAPIKeys')
    Route.put('/api-keys', 'AuthController.generateNewKey')
    Route.delete('/api-keys', 'AuthController.revokeKey')
  }).middleware('auth:jwt')
}).prefix('req').middleware('protect')

/*Route.group(() => {
  Route.post('/craya', 'ModelsController.crayaExport')
}).prefix('export')*/

