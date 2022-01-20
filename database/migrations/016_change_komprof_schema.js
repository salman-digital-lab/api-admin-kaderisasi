'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LSchema extends Schema {
  up () {
    this.table('members', (table) => {
      table.string('komprof').alter()
    })
  }

  down () {
    this.table('members', (table) => {
      table.integer('komprof').alter()
    })
  }
}

module.exports = LSchema
