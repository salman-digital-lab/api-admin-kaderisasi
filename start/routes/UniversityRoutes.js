const Route = use('Route')

Route.group(() => {

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

}).prefix('/v1/universities').middleware(['auth', 'privileges:universities']);

Route.get(
    '/v1/universities/',
    'UniversityController.getUniversities'
);