'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIndexToMemberRoleSchema extends Schema {
  up () {
    this.table('member_roles', (table) => {
      table.integer('index', 10).notNullable().unique()
    })
  }

  down () {
    this.table('member_roles', (table) => {
      table.dropColumn('index')
      // reverse alternations
    })
  }
}

module.exports = AddIndexToMemberRoleSchema
