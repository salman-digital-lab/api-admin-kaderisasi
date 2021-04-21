'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionProvinceSchema extends Schema {
  up () {
    this.create('region_provinces', (table) => {
      table.string('id', 2)
      table.string('name')
      table.timestamp('created_date').defaultTo(this.fn.now())
      table.primary(['id'])
    })
  }

  down () {
    this.drop('region_provinces')
  }
}

module.exports = RegionProvinceSchema
