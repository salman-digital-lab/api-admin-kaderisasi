'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChecklistSchema extends Schema {
  up() {
    this.create('checklists', (table) => {
      table.increments()
      table.string('checklist_name', 255).notNullable()
      table.integer('admin_id').unsigned()
      table.foreign('admin_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamps()
    })
  }

  down() {
    this.drop('checklists')
  }
}

module.exports = ChecklistSchema
