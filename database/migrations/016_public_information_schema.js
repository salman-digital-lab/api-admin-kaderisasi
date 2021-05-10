'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicInformationSchema extends Schema {
  up () {
    this.create('public_informations', (table) => {
      table.increments('id').primary()
      table.string('information_name').notNullable()
      table.string('information_slug').notNullable()
      table.string('information_description').notNullable()
      table.datetime('createdDate').nullable()
    })
  }

  down () {
    this.drop('public_informations')
  }
}

module.exports = PublicInformationSchema
