'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MemberChecklistSchema extends Schema {
  up() {
    this.create('member_checklists', (table) => {
      table.increments()
      table.integer('member_id').unsigned()
      table.foreign('member_id').references('id').inTable('members').onDelete('CASCADE')
      table.integer('checklist_id').unsigned()
      table.foreign('checklist_id').references('id').inTable('checklists').onDelete('CASCADE')
      table.unique(['member_id', 'checklist_id'])
      table.timestamps()
    })
  }

  down() {
    this.drop('member_checklists')
  }
}

module.exports = MemberChecklistSchema
