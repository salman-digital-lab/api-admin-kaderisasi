const Route = use('Route')

Route.group(() => {
    Route.post('carousel', 'ActivityCarouselController.store')
    Route.get('carousel/:activity_id', 'ActivityCarouselController.show')
    Route.delete('carousel/:id', 'ActivityCarouselController.destroy')
    Route.put('carousel/:id/isBanner', 'ActivityCarouselController.updateIsBanner')
}).prefix("v1/activity");
