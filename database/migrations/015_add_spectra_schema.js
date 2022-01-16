'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSpectraSchema extends Schema {
  up () {
    this.table('members', (table) => {
      table.integer('spectra')
    })
  }

  down () {
    this.table('members', (table) => {
      table.dropColumn('spectra')
    })
  }
}

module.exports = AddSpectraSchema
