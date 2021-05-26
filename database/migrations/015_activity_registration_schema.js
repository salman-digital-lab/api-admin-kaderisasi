'use strict'

const Schema = use('Schema')

class ActivityRegistrationSchema extends Schema {
  up() {
    this.create('activity_registrations', (table) => {
      table.increments()
      table.integer('member_id', 11).notNullable()
      table.integer('activity_id', 11).unsigned().notNullable()
      table.foreign('activity_id').references('activities.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.enu('status', ['REGISTERED', 'JOINED', 'PASSED', 'FAILED', 'REJECTED']).default('REGISTERED')
      table.datetime('created_at').nullable()
    })
  }

  down() {
    this.drop('activity_registrations')
  }
}

module.exports = ActivityRegistrationSchema
