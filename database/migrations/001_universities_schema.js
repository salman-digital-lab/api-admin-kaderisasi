'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UniversitiesSchema extends Schema {
  up () {
    this.create('university', (table) => {
      table.increments('id')
      table.string('name', 100)
      table.timestamp('created_at').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('university')
  }
}

module.exports = UniversitiesSchema
