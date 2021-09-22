const Route = use('Route')

Route.group(() => {
	Route.get('/:activity_id/questionnaire/statistics', 'ActivityQuestionnaireController.get')
    Route.get('/:activity_id/questionnaire', 'ActivityQuestionnaireController.index')
    Route.put('/:activity_id/questionnaire', 'ActivityQuestionnaireController.update')
}).prefix("v1/activity");
