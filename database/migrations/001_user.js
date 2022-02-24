'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('salt', 255)
      table.string('forgotten_password_code', 40)
      table.boolean('active').defaultTo(true)
      table.string('display_name', 125)
      table.string('first_name', 50)
      table.string('last_name', 50)
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
