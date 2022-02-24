'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GroupsPrivilegesSchema extends Schema {
  up () {
    this.create('groups_privileges', (table) => {
    	table.integer('group_id').notNullable().unsigned().references('id').inTable('groups').onDelete('CASCADE')
    	table.integer('privilege_id').notNullable().unsigned().references('id').inTable('privileges').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('groups_privileges')
  }
}

module.exports = GroupsPrivilegesSchema
