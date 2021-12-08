'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentCareSchema extends Schema {
  up () {
    this.create('student_care', (table) => {
      table.increments('id').primary()
      table.integer('member_id', 11).unsigned().notNullable()
      table.foreign('member_id').references('members.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.enu('problem_owner', ['Diri Sendiri', 'Teman']).default(null)
      table.string('problem_owner_name', 35).default(null)
      table.string('problem_category', 20).notNullable().default(null)
      table.string('problem_category_desk', 50).default(null)
      table.enu('technical_handling', ['Online', 'Bertemu langsung']).default(null)
      table.enu('counselor_gender', ['Laki-laki', 'Perempuan', 'Keduanya']).default(null)
      table.integer('id_counselor').nullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enu('status_handling', ['Belum Ditangani', 'Sedang Ditangani', 'Sudah Ditangani']).default('Belum Ditangani')
      table.text('desk_handling').default(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('student_care')
  }
}

module.exports = StudentCareSchema
