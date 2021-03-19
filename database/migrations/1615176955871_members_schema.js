'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MembersSchema extends Schema {
  up () {
    this.create('members', (table) => {
      table.increments('id',11).primary()
      table.string('name', 50).notNullable()
      table.string('gender').notNullable()
      table.string('email', 50).notNullable()
      table.string('phone', 35).notNullable()
      table.string('line_id',35).notNullable()
      table.integer('province_id',11).unsigned().references('id').inTable('region_provinces')
      table.integer('regency_id',11).unsigned().references('id').inTable('region_regencies')
      table.integer('district_id',7).unsigned().references('id').inTable('region_districts')
      table.integer('village_id',11).unsigned().references('id').inTable('region_villages')
      table.date('date_of_birthday').notNullable()
      table.string('city_of_birth', 35).notNullable()
      table.string('from_address', 255).notNullable()
      table.string('current_address', 255).notNullable()
      table.integer('university_id',11).unsigned().references('id').inTable('universities')
      table.string('faculty', 50).notNullable()
      table.string('major', 50).notNullable()
      table.string('student_id', 25).notNullable()
      table.string('intake_year', 4).notNullable()
      table.integer('role_id', 11).unsigned().references('id').inTable('member_roles')
      table.timestamps(true, true)
      table.string('is_active', 25).notNullable()
      table.string('password', 35).notNullable()
      table.string('salt').notNullable()
      table.integer('ssc', 4).notNullable()
      table.integer('lmd', 4).notNullable()
      table.integer('komprof', 4).notNullable()
      table.string('is_subscribing',1).notNullable()
      table.string('file_image', 100).notNullable()
    })
  }

  down () {
    this.drop('members')
  }
}

module.exports = MembersSchema
