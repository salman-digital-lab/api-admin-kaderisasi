const Route = use('Route')

Route.group(() => {
    Route.get('participant-questionnaire/:member_id/:activity_id', 'ActivityParticipanController.show_questionnaire')
    Route.get('participants/:activity_id/:status', 'ActivityParticipanController.show_participants')
    Route.get('participant-statistics/:activity_id', 'ActivityParticipanController.show_statistics')
    Route.put('update-participant-status/:member_id/:activity_id/:status', 'ActivityParticipanController.update_registration_status')
    Route.get('export-participant/:activity_id', 'ActivityParticipanController.export')
}).prefix("v1/activity");