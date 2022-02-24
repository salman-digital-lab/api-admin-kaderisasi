'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StudentCare extends Model {
  member () {
    return this.belongsTo('App/Models/Member', 'member_id', 'id')
  }

  counselor () {
    return this.belongsTo('App/Models/User', 'id_counselor', 'id')
  }

  static get table () {
    return 'student_care'
  }
}

module.exports = StudentCare
