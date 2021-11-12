const Route = use('Route')

Route.group(() => {

    Route.get(
        '/provinces',
        'RegionController.getProvinces'
    );

    Route.get(
        '/regencies/:id',
        'RegionController.getRegenciesByProvinceId'
    );

    Route.get(
        '/districts/:id',
        'RegionController.getDistrictsByRegencyId'
    );

    Route.get(
        '/villages/:id',
        'RegionController.getVillagesByDistrictId'
    );

}).prefix('/v1/regions');