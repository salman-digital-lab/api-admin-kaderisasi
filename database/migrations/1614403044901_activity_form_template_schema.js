'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivityFormTemplateSchema extends Schema {
  up() {
    this.create('activity_form_templates', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.text('data', 'longtext').nullable()
      table.integer('is_used', 1).default(0)
    })
  }

  down() {
    this.drop('activity_form_templates')
  }
}

module.exports = ActivityFormTemplateSchema
