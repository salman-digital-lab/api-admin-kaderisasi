'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlumniSchema extends Schema {
  up () {
    this.create('alumni', (table) => {
      table.increments().primary()
      table.string('name', 50).notNullable()
      table.string('email', 50).notNullable().unique()
      table.string('whatsapp_number', 35)
      table.string('full_address', 256)
      table.string('occupation', 256)
      table.string('current_instance', 256)
      table.string('bachelor_degree', 256)
      table.string('master_degree', 256)
      table.string('doctoral_degree', 256)
      table.string('contributions', 256)
      table.integer('is_donor', 1)
      table.integer('is_subscriber', 1)
      table.string('notes', 256) // additional notes regarding the alumni
      table.timestamps()
    })
  }

  down () {
    this.drop('alumni')
  }
}

module.exports = AlumniSchema
