'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddMaximumRoleIdSchema extends Schema {
  up () {
    this.table('activities', (table) => {
      table.integer('maximum_role_id', 11).default(50)
    })
  }

  down () {
    this.table('activities', (table) => {
      table.dropColumn('maximum_role_id')
      // reverse alternations
    })
  }
}

module.exports = AddMaximumRoleIdSchema