'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Group extends Model {

    static get table() {
        return 'groups'
    }

    static get createdAtColumn() {
        return null;
    }

    static get updatedAtColumn() {
        return null;
    }

    users_group() {
        return this.hasMany('App/Models/UsersGroup')
    }
}

module.exports = Group
