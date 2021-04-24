'use strict'

const Factory = use('Factory')
const Village = use('App/Models/Region/Village')
const Universities = use('App/Models/University')

class MemberSeeder {
  async run () {
	const villages = await Village.all()
	const universities = await Universities.all()
	await Factory.model('App/Models/Member').createMany(20, {
		universities: universities,
		villages: villages
	})
  }
}

module.exports = MemberSeeder
