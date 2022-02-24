'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Class extends Model {
  sections() {
    return this.hasMany('App/Models/ClassSection')
  }
}

module.exports = Class
