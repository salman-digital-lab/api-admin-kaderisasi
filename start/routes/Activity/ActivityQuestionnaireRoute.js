const Route = use('Route')

Route.group(() => {
	Route.get('/:activity_id/questionnaire/statistics', 'ActivityQuestionnaireController.get')
    Route.resource('/:activity_id/questionnaire', 'ActivityQuestionnaireController').only(['index', 'put'])
}).prefix("v1/activity");
