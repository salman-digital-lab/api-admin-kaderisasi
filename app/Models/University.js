'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class University extends Model {
	static boot () {
		super.boot()
	}

	static get table () {
        return 'university'
    }

	static get updatedAtColumn() {
		return null;
	  }
}

module.exports = University
