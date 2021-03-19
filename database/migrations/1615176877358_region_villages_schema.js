'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionVillagesSchema extends Schema {
  up () {
    this.create('region_villages', (table) => {
      table.increments('id',10).primary()
      table.integer('district_id',7).unsigned().references('id').inTable('region_districts')
      //table.foreign('district_id').references('region_districts.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.string('name',255).notNullable()
    })
  }

  down () {
    this.drop('region_villages')
  }
}

module.exports = RegionVillagesSchema
