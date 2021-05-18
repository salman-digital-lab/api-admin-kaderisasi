'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaveQuestionnaireSchema extends Schema {
  up() {
    this.create('save_questionnaires', (table) => {
      table.increments()
      table.integer('id_registration', 11).notNullable()
      table.foreign('id_registration').references('activity_registrations.id').onDelete('CASCADE')
      table.string('id_name', 255).notNullable()
      table.text('answer').nullable()
    })
  }

  down() {
    this.table('save_questionnaires', (table) => {
      table.dropForeign('id_registration', 'save_questionnaires_id_registration_foreign')
    })
    this.drop('save_questionnaires')
  }
}

module.exports = SaveQuestionnaireSchema
