'use strict'

const ActivityRegistration = use('App/Models/ActivityRegistration')
const Member = use('App/Models/Member')
const Activities = use('App/Models/Activity')
const Database = use('Database')

/** Require helper class to be loaded */
const QuestionnaireSeedingHelper = require('../helpers/QuestionnaireSeedingHelper')

class ActivityRegistrationSeeder {
  async run () {
    const members = await Member.all()
    const activities = await Activities.all()
    const registrationStatus = ActivityRegistration.registrationStatus()
    const registration_items = []

    /**
    Create registration for members in all eligible activites,
    with 50% chance of not registered for testing purpose
    */
    for (const member of members.rows) {
      const eligible_activites = activities.rows.filter(function (activity) {
        return activity.minimum_role_id <= member.role_id && Math.random() > 0.5
      })

      const registration_data = eligible_activites.map(function (activity) {
        return {
          member_id: member.id,
          activity_id: activity.id,
          status: registrationStatus[Math.floor(Math.random() * registrationStatus.length)]
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
      const answers = QuestionnaireSeedingHelper.formAnswer
      questionnaire_items.push(answers.map(function (row) {
        row.id_registration = registration.id
        row.answer = JSON.stringify(row.answer)
        return row
      }))
    }
    const reduced_items = questionnaire_items.reduce((acc, current) => {
      return acc.concat(current)
    })

    await Database.insert(reduced_items).into('save_questionnaire')
  }
}

module.exports = ActivityRegistrationSeeder
