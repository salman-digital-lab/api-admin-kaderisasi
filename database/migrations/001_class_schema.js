'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClassSchema extends Schema {
  up () {
    this.create('classes', (table) => {
      table.increments()
      table.string('title', 255).notNullable()
      table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('classes')
  }
}

module.exports = ClassSchema
