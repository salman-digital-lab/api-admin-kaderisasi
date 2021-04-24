'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersGroupsSchema extends Schema {
  up() {
    this.create('users_groups', (table) => {
      table.integer('user_id').primary().notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('group_id').notNullable().unsigned().references('id').inTable('groups').onDelete('CASCADE')

    })
  }

  down() {
    this.drop('users_groups')
  }
}

module.exports = UsersGroupsSchema
