'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddIsactiveFieldToActivityCategoriesSchema extends Schema {
  up () {
    this.table('activity_categories', (table) => {
      table.boolean('is_active').defaultTo(true)
    })
  }

  down () {
    this.table('activity_categories', (table) => {
      table.dropColumn('is_active')
    })
  }
}

module.exports = AddIsactiveFieldToActivityCategoriesSchema
