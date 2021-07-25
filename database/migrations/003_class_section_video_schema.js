'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClassSectionVideoSchema extends Schema {
  up () {
    this.create('class_section_videos', (table) => {
      table.increments()
      table.string('title', 100).notNullable()
      table.string('link', 255).notNullable()
      table.integer('section_id').unsigned()
      table.foreign('section_id').references('id').inTable('class_sections')
      table.timestamps()
    })
  }

  down () {
    this.drop('class_section_videos')
  }
}

module.exports = ClassSectionVideoSchema
