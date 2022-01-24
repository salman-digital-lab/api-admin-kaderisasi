'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentCareSchema extends Schema {
  up () {
    this.table('student_care', (table) => {
      table.text('problem_category_desk').alter()
      table.string('problem_category', 255).alter()
    })
  }

  down () {
    this.table('student_care', (table) => {
      table.string('problem_category_desk', 50).alter()
      table.string('problem_category', 20).alter()
    })
  }
}

module.exports = StudentCareSchema
