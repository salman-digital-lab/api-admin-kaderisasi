'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Group extends Model {
    users_group() {
        return this.hasMany('App/Models/UsersGroup')
    }
}

module.exports = Group
