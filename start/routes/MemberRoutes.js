const Route = use('Route')

Route.group(() => {

    Route.get(
        '/',
        'MemberController.getMembers'
    )

}).prefix('/v1/members');

Route.group(() => {

    Route.get(
        '/:id',
        'MemberController.getMember'
    )

    Route.patch(
        '/:id/block',
        'MemberController.blockMember'
    )

}).prefix('/v1/member');