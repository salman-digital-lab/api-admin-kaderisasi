'use strict'

const Schema = use('Schema')

class ActivityCategoriesSchema extends Schema {
  up () {
    this.create('activity_categories', (table) => {
      table.increments()
      table.string('name', 255).default(null)
    })
  }

  down () {
    this.drop('activity_categories')
  }
}

module.exports = ActivityCategoriesSchema
