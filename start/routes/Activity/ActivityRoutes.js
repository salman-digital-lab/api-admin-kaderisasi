const Route = use('Route')

Route.group(() => {
    Route.resource('activity-category', 'ActivityCategoryController').apiOnly()
    Route.resource('activity', 'ActivityController').apiOnly()
    Route.resource('activity-form-template', 'ActivityFormTemplateController').apiOnly()
}).prefix('v1').middleware(['auth', 'activeUser', 'privileges:activity'])