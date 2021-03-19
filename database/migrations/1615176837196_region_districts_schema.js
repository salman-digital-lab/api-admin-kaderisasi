'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionDistrictsSchema extends Schema {
  up () {
    this.create('region_districts', (table) => {
      table.increments('id').primary()
      table.integer('regency_id',11).unsigned().references('id').inTable('region_regencies')
      //table.foreign('regency_id').references('region_regencies.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.string('name',255).notNullable()
    })
  }

  down () {
    this.drop('region_districts')
  }
}

module.exports = RegionDistrictsSchema
