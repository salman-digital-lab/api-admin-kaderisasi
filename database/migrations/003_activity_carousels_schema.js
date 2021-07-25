'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivityCarouselsSchema extends Schema {
  up () {
    this.create('activity_carousels', (table) => {
      table.increments()
      table.integer('activity_id', 11).unsigned().notNullable()
      table.foreign('activity_id').references('activities.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('filename', 100)
      table.boolean('is_banner').defaultTo(false)
    })
  }

  down () {
    this.drop('activity_carousels')
  }
}

module.exports = ActivityCarouselsSchema
