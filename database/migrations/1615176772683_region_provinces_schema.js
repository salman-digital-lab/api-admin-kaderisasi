'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionProvincesSchema extends Schema {
  up () {
    this.create('region_provinces', (table) => {
        table.increments('id').primary()
        table.string('name', 200).notNullable()
    })
  }

  down () {
    this.drop('region_provinces')
  }
}

module.exports = RegionProvincesSchema
