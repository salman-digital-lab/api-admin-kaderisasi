'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Privilege extends Model {
	static boot() {
        super.boot()
        this.addTrait('NoTimestamp')
    }

    static get table() {
    	return 'privileges'
    }
}

module.exports = Privilege
