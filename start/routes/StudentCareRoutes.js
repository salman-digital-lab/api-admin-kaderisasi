const Route = use('Route')

Route.group(() => {
  Route.delete('studentCare/:id', 'StudentCareController.delete')
  Route.get('studentCare', 'StudentCareController.get')
  Route.get('studentCare/:id', 'StudentCareController.getById')
  Route.put('studentCare/:id', 'StudentCareController.update')
}).prefix('/v1')