'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFileImageSchema extends Schema {
  up() {
    this.table('users', (table) => {
      table.string('file_image', 100)
    })
  }

  down() {
    this.table('users', (table) => {
      table.dropColumn('file_image')
    })
  }
}

module.exports = AddFileImageSchema
