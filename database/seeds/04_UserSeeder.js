'use strict'

const Factory = use('Factory')

class UserSeeder {
  async run () {
  	await Factory.model('App/Models/User').createMany(20)
  }
}

module.exports = UserSeeder
