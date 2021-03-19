'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UniversitiesSchema extends Schema {
  up () {
    this.create('universities', (table) => {
      table.increments('id',11).primary()
      table.string('name', 200).notNullable()
    })
  }

  down () {
    this.drop('universities')
  }
}

module.exports = UniversitiesSchema
