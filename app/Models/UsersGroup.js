'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UsersGroup extends Model {

    static get createdAtColumn() {
        return null;
    }

    static get updatedAtColumn() {
        return null;
    }

    user() {
        return this.belongsTo('App/Models/User')
    }

    groups() {
        return this.belongsTo('App/Models/Group')
    }
}

module.exports = UsersGroup
