'use strict'

const Factory = use('Factory')
const Database = use('Database')

const Member = use('App/Models/Member')
const Activities = use('App/Models/Activity')
const ActivityRegistration = use('App/Models/ActivityRegistration')
const Questionnaire = use('App/Models/SaveQuestionnaire')


// We rather move questionnaire here
class RegistrationAndQuestionnaireSeeder {
  async run() {
	const members = await Member.all()
	const activities = await Activities.all()
	const registrationStatus = ActivityRegistration.registrationStatus()
	var registration_items = []
	for (const member of members.rows) {
		const eligible_activites = activities.rows.filter(function(activity) {
			return activity.minimum_role_id <= member.role_id
		})

		const registration_data = eligible_activites.map(function(activity) {
			return {
				member_id: member.id,
				activity_id : activity.id, 
				status: registrationStatus[Math.floor(Math.random()*registrationStatus.length)]
			}
		})

		for (const reg of registration_data) {
			registration_items.push(reg)
		}
	}

	await Database.insert(registration_items).into(ActivityRegistration.table)

	// We feed questionnaire after all registrations are saved
	const questionnaire_items = []
	const registrations = await ActivityRegistration.all()
	for (const registration of registrations.rows) {
		questionnaire_items.push({
			id_registration : registration.id,
			id_name : "text-15529591",
			answer : "Something something"
		})

		questionnaire_items.push({
			id_registration : registration.id,
			id_name : "dropdown-1414155",
			answer : "label1"
		})
	}

	await Database.insert(questionnaire_items).into(Questionnaire.table)
  }
}

module.exports = RegistrationAndQuestionnaireSeeder
