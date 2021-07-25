'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionDistrictsSchema extends Schema {
  up () {
    this.create('region_districts', (table) => {
      table.string('id', 7)
      table.string('regency_id', 4).references('id').inTable('region_regencies').onDelete('CASCADE')
      table.string('name')
      table.primary(['id'])
    })
  }

  down () {
    this.drop('region_districts')
  }
}

module.exports = RegionDistrictsSchema
