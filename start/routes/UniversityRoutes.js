const Route = use('Route')

Route.group(() => {

    Route.get(
        '/',
        'UniversityController.getUniversities'
    );

    Route.post(
        '/',
        'UniversityController.createUniversity'
    );

    Route.put(
        '/:id',
        'UniversityController.updateUniversity'
    );

    Route.delete(
        '/:id',
        'UniversityController.deleteUniversity'
    );

}).prefix('/v1/universities');
