'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivityCarouselsSchema extends Schema {
  up() {
    this.create('activity_carousels', (table) => {
      table.integer('activity_id', 11).unsigned().notNullable()
      table.foreign('activity_id').references('activities.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('filename', 100)
    })
  }

  down() {
    this.drop('activity_carousels')
  }
}

module.exports = ActivityCarouselsSchema
