'use strict'

const Schema = use('Schema')

class MemberSchema extends Schema {
  up () {
    this.create('members', table => {
      table.increments()
      table.string('name', 50).notNullable()
      table.enu('gender',['M','F'])
      table.string('email', 50).notNullable().unique()
      table.string('phone',35)
      table.string('line_id',35)
      table.string('province_id',2)
      table.foreign('province_id').references('id').inTable('region_provinces');
      table.string('regency_id',4)
      table.foreign('regency_id').references('id').inTable('region_regencies');
      table.string('district_id',7)
      table.foreign('district_id').references('id').inTable('region_districts');
      table.string('village_id',10)
      table.foreign('village_id').references('id').inTable('region_villages');
      table.date('date_of_birthday')
      table.string('city_of_birth',35)
      table.string('from_address',255)
      table.string('current_address',255)
      table.integer('university_id').unsigned();
      table.foreign('university_id').references('id').inTable('universities');
      table.string('faculty',50)
      table.string('major',50)
      table.string('student_id',25)
      table.string('intake_year',4)
      table.integer('role_id').defaultTo(4)
      table.integer('is_active').defaultTo(1)
      table.string('password', 100).notNullable()
      table.string('salt')
      table.integer('ssc')
      table.integer('lmd')
      table.integer('komprof')
      table.integer('is_subscribing').defaultTo(1)
      table.string('file_image',100)
      table.timestamps()
    })
  }

  down () {
    this.drop('members')
  }
}

module.exports = MemberSchema
