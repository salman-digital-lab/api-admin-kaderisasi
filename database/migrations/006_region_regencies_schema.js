'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionRegenciesSchema extends Schema {
  up () {
    this.create('region_regencies', (table) => {
      table.string('id', 4)
      table.string('province_id', 2).references('id').inTable('region_provinces').onDelete('CASCADE')
      table.string('name')
      table.primary(['id'])
    })
  }

  down () {
    this.drop('region_regencies')
  }
}

module.exports = RegionRegenciesSchema
