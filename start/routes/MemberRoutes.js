const Route = use('Route')

Route.group(() => {

    Route.get(
        '/',
        'MemberController.getMembers'
    )

}).prefix('/v1/members').middleware(['auth', 'privileges:members']);

Route.group(() => {

    Route.get(
        '/:id/activities',
        'MemberController.getMemberActivities'
    )

    Route.get(
        '/:id',
        'MemberController.getMember'
    )

    Route.patch(
        '/:id/block',
        'MemberController.blockMember'
    )

    Route.put(
        '/:id/',
        'MemberController.updateMember'
    )

}).prefix('/v1/member').middleware(['auth', 'privileges:members']);