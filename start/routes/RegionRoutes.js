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

    Route.delete(
        '/provinces/:id',
        'RegionController.deleteProvince'
    );

    Route.delete(
        '/regencies/:id',
        'RegionController.deleteRegency'
    );

    Route.delete(
        '/districts/:id',
        'RegionController.deleteDistrict'
    );

    Route.delete(
        '/villages/:id',
        'RegionController.deleteVillage'
    );

}).prefix('/v1/regions');