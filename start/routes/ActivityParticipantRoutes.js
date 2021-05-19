const Route = use('Route')

Route.group(() => {
    Route.get('participant/:registration_id', 'ActivityParticipanController.show')
    Route.put('participant/:registration_id/:status', 'ActivityParticipanController.update_status')
    Route.get('participant/:registration_id/questionnaire', 'ActivityParticipanController.show_questionnaire')
    Route.get(':activity_id/participant', 'ActivityParticipanController.index')
    Route.get(':activity_id/participant/statistics', 'ActivityParticipanController.show_statistics')
    Route.get(':activity_id/participant/export', 'ActivityParticipanController.export')
}).prefix("v1/activity");
