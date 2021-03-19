'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegionRegenciesSchema extends Schema {
  up () {
    this.create('region_regencies', (table) => {
      table.increments('id').primary()
      //table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('province_id',11).unsigned().references('id').inTable('region_provinces')
      //table.foreign('province_id').references('region_provinces.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.string('name',255).notNullable()
    })
  }

  down () {
    this.drop('region_regencies')
  }
}

module.exports = RegionRegenciesSchema
