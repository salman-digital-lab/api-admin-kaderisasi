'use strict'

const Factory = use('Factory')

class ActivitySeeder {
  async run() {
    await Factory.model('App/Models/Activity').createMany(50)
  }
}

module.exports = ActivitySeeder
