'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MembersSchema extends Schema {
  up () {
    this.create('members', (table) => {
      table.increments('id',11).primary()
      table.string('name', 50).notNullable()
      table.enu('gender',['M','F'])
      table.string('email', 50).notNullable()
      table.string('phone', 35)
      table.string('line_id',35)
      table.string('province_id',11).references('id').inTable('region_provinces')
      table.string('regency_id',11).references('id').inTable('region_regencies')
      table.string('district_id',7).references('id').inTable('region_districts')
      table.string('village_id',11).references('id').inTable('region_villages')
      table.date('date_of_birthday')
      table.string('city_of_birth', 35)
      table.string('from_address', 255)
      table.string('current_address', 255)
      table.integer('university_id',11).unsigned().references('id').inTable('universities')
      table.string('faculty', 50)
      table.string('major', 50)
      table.string('student_id', 25)
      table.string('intake_year', 4)
      table.integer('role_id', 11).unsigned().references('id').inTable('member_roles')
      table.integer('is_active', 1).defaultTo(1)
      table.string('password', 60).notNullable()
      table.string('salt', 12).notNullable()
      table.integer('ssc', 4)
      table.integer('lmd', 4)
      table.integer('komprof', 4)
      table.integer('is_subscribing',1).notNullable().defaultTo(1)
      table.string('file_image', 100)
      table.timestamps()
    })
  }

  down () {
    this.drop('members')
  }
}

module.exports = MembersSchema
