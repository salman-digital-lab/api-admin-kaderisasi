const Route = use('Route')

Route.group(() => {

    Route.get(
        '/',
        'MemberController.getMembers'
    )

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

    Route.patch(
        '/:id/unblock',
        'MemberController.unblockMember'
    )

    Route.put(
        '/:id/',
        'MemberController.updateMember'
    )

}).prefix('/v1/members').middleware(['auth', 'privileges:members']);