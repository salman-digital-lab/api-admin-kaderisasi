'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Alumni extends Model {
    static get table () {
        return 'alumni'
    }
}

module.exports = Alumni
