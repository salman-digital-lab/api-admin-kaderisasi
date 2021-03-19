'use strict'

const Schema = use('Schema')

class ActivitiesSchema extends Schema {
  up() {
    this.create('activities', (table) => {
      table.increments()
      table.string('name', 255).notNullable().default(null)
      table.string('slug', 255).unique().notNullable().default(null)
      table.text('description').nullable()
      table.date('begin_date').notNullable().default(null)
      table.date('end_date').notNullable().default(null)
      table.date('register_begin_date').notNullable().default(null)
      table.date('register_end_date').notNullable().default(null)
      table.enu('status', ['OPENED', 'CLOSED']).default('OPENED')
      table.integer('minimum_role_id', 11).default(0)
      table.integer('category_id', 11).unsigned().nullable().default(null)
      table.foreign('category_id').references('activity_categories.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.timestamp('created_at').defaultTo(this.fn.now())
      table.string('banner_image', 100).default(null)
      table.integer('form_id', 11).unsigned().nullable().default(null)
      table.foreign('form_id').references('activity_form_templates.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.integer('is_published', 1).default(1)
      table.integer('is_deleted', 1).default(0)
    })
  }

  down() {
    this.table('activities', (table) => {
      table.dropIndex('slug', 'activities_slug_unique')
      table.dropForeign('category_id', 'activities_category_id_foreign')
      table.dropForeign('form_id', 'activities_form_id_foreign')
    })
    this.drop('activities')
  }
}

module.exports = ActivitiesSchema
