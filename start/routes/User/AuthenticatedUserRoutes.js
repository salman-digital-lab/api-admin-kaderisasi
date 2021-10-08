const Route = use('Route')

Route.group(() => {
  Route.put('change-password', 'AuthenticatedUserController.resetPassword')
  Route.put('', 'AuthenticatedUserController.update')
  Route.get('', 'AuthenticatedUserController.show')
}).prefix('v1/user').middleware(['auth', 'activeUser'])