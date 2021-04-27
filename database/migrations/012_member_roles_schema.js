'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MemberRolesSchema extends Schema {
  up () {
    this.create('member_roles', (table) => {
      table.increments('id',11).primary()
      table.string('name',20).notNullable()
      table.string('shortname',3).notNullable()
      table.string('description',255).notNullable()
    })
  }

  down () {
    this.drop('member_roles')
  }
}

module.exports = MemberRolesSchema
