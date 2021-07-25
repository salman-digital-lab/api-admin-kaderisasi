'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UniversitiesSchema extends Schema {
  up () {
    this.create('universities', (table) => {
      table.increments('id')
      table.string('name', 100)
    })
  }

  down () {
    this.drop('universities')
  }
}

module.exports = UniversitiesSchema
