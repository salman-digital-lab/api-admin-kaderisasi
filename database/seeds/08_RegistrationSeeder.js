'use strict'

const Factory = use('Factory')
const Database = use('Database')

const Member = use('App/Models/Member')
const Activities = use('App/Models/Activity')
const ActivityRegistration = use('App/Models/ActivityRegistration')

class RegistrationSeeder {
  async run() {
	const members = await Member.all()
	const activities = await Activities.all()
	const registrationStatus = ActivityRegistration.registrationStatus
	for (const member of members.rows) {
		const eligible_activites = activities.rows.filter(function(activity) {
			return activity.minimum_role_id <= member.role_id
		})

		const registration_data = eligible_activites.map(function(activity) {
			return {
				member_id: member.id,
				activity_id : activity.id, 
				questionnaire : "[]",
				status: registrationStatus[Math.floor(Math.random()*registrationStatus.length)]
			}
		})
		await Database.insert(registration_data).into(ActivityRegistration.table)
	}
  }
}

module.exports = RegistrationSeeder
