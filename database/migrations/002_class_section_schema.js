'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClassSectionSchema extends Schema {
  up () {
    this.create('class_sections', (table) => {
      table.increments()
      table.string('title', 100).notNullable()
      table.integer('class_id').unsigned()
      table.foreign('class_id').references('id').inTable('classes')
      table.timestamps()
    })
  }

  down () {
    this.drop('class_sections')
  }
}

module.exports = ClassSectionSchema
