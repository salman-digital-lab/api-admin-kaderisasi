'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class District extends Model {
	static boot () {
		super.boot()
		this.addTrait('NoTimestamp')
	}

	static get table () {
		return 'region_districts'
	}

	regency () {
		return this.belongsTo('App/Models/Region/Regency', 'regency_id', 'id')
	}

	villages () {
		return this.hasMany('App/Models/Region/Village')
	}
}

module.exports = District
