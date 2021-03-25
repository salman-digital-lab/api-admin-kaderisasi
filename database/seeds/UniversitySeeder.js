'use strict'

const Factory = use('Factory')

class UniversitySeeder {
  async run () {
  	await Factory.model('App/Models/University').createMany(20)
  }
}

module.exports = UniversitySeeder
