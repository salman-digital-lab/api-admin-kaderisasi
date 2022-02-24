'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GroupSchema extends Schema {
  up () {
    this.create('groups', (table) => {
      table.increments()
      table.string('name', 20).notNullable()
      table.string('shortname', 3)
      table.string('description', 255).notNullable().defaultTo('')
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.boolean('disabled').notNullable().defaultTo(false)
    })
  }

  down () {
    this.drop('groups')
  }
}

module.exports = GroupSchema
