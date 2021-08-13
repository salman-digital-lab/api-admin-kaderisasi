const Route = use('Route')

Route.group(() => {
    Route.post('banner', 'ActivityCarouselController.store')
    Route.get(':activity_id/banner', 'ActivityCarouselController.show')
    Route.delete('banner/:id', 'ActivityCarouselController.destroy')
}).prefix("v1/activity");
