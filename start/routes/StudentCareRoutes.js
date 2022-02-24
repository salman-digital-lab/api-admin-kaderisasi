const Route = use('Route')

Route.group(() => {
  Route.delete(':id', 'StudentCareController.delete')
  Route.get('', 'StudentCareController.get')
  Route.get('counselors', 'StudentCareController.getCounselors')
  Route.get(':id', 'StudentCareController.getById')
  Route.put(':id', 'StudentCareController.update')
}).prefix('/v1/student-care').middleware(['auth', 'activeUser', 'privileges:student-care'])
