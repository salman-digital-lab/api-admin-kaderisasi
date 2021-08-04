'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaveQuestionnaireSchema extends Schema {
  up () {
    this.create('save_questionnaire', (table) => {
      table.increments()
      table.integer('id_registration', 11).unsigned().notNullable()
      table.foreign('id_registration').references('activity_registrations.id').onDelete('CASCADE')
      table.string('id_name', 255).notNullable()
      table.text('answer').nullable()
    })
  }

  down () {
    this.drop('save_questionnaire')
  }
}

module.exports = SaveQuestionnaireSchema
