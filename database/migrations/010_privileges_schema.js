'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PrivilegesSchema extends Schema {
  up () {
    this.create('privileges', (table) => {
      table.increments()
      table.string('name', 60).notNullable().unique()
      table.text('description').nullable()
    })
  }

  down () {
    this.drop('privileges')
  }
}

module.exports = PrivilegesSchema
