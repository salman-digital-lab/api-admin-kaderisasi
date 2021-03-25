'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionVillagesSchema extends Schema {
  up () {
    this.create('region_villages', (table) => {
      table.string('id', 10)
      table.string('district_id', 7).references('id').inTable('region_districts').onDelete('CASCADE')
      table.string('name')
      table.primary(['id'])
    })
  }

  down () {
    this.drop('region_villages')
  }
}

module.exports = RegionVillagesSchema
