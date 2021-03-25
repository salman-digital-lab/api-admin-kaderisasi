'use strict'

const ActivityRegistration = use("App/Models/ActivityRegistration");
const Schema = use('Schema')

class ActivityRegistrationSchema extends Schema {
  up() {

    const regexStatus = ActivityRegistration.regexStatus();

    this.create('activity_registrations', (table) => {
      table.integer('member_id', 11).notNullable()
      table.integer('activity_id', 11).unsigned().notNullable()
      table.foreign('activity_id').references('activities.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.text('questionnaire').nullable()
      table.enu('status', regexStatus).default('REGISTERED').notNullable()
      table.datetime('created_at').nullable()
    })
  }

  down() {
    this.table('activity_registrations', (table) => {
      table.dropForeign('activity_id', 'activity_registrations_activity_id_foreign')
    })
    this.drop('activity_registrations')
  }
}

module.exports = ActivityRegistrationSchema
