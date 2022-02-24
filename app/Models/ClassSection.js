'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ClassSection extends Model {
  class() {
    return this.belongsTo('App/Models/Class')
  }
  videos() {
    return this.hasMany('App/Models/ClassSectionVideo', 'id', 'section_id')
  }
}

module.exports = ClassSection
