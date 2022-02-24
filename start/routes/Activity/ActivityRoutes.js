const Route = use('Route')

Route.group(() => {
    Route.resource('activity-category', 'ActivityCategoryController').apiOnly().except(['destroy'])
    Route.put('activity-category/:id/set-active', 'ActivityCategoryController.setActive')
    Route.patch('activity-category/:id/set-active', 'ActivityCategoryController.setActive')
    Route.resource('activity', 'ActivityController').apiOnly()
    Route.resource('activity-form-template', 'ActivityFormTemplateController').apiOnly()
}).prefix('v1').middleware(['auth', 'activeUser', 'privileges:activity'])