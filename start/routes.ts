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
  }).prefix('/v1')
}).prefix('api').middleware('auth:api')

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

    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
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

    Route.put('/models', 'ModelsController.create')
    Route.patch('/models', 'ModelsController.update')
    Route.delete('/models', 'ModelsController.delete')

    Route.put('/blocks', 'BlocksController.create')
    Route.patch('/blocks', 'BlocksController.update')
    Route.delete('/blocks', 'BlocksController.delete')

    Route.post('/sync/supporters', 'SyncsController.syncSupporters')
    Route.post('/sync/patrons', 'SyncsController.syncPatrons')

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
  }).middleware('auth:web')
}).prefix('req').middleware('protect')
