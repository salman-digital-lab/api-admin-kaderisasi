'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Regency extends Model {
	static boot () {
		super.boot()
		this.addTrait('NoTimestamp')
	}

	static get table () {
		return 'region_regencies'
	}

	province () {
		return this.belongsTo('App/Models/Region/Province', 'province_id', 'id')
	}

	districts () {
		return this.hasMany('App/Models/Region/District')
	}
}

module.exports = Regency
