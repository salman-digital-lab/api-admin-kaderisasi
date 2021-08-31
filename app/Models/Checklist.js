'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Checklist extends Model {
  members() {
    return this
      .belongsToMany('App/Models/Member')
      .pivotTable('member_checklists')
  }
}

module.exports = Checklist
