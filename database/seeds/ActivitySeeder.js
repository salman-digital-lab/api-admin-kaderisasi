'use strict'

const Factory = use('Factory')

class ActivitySeeder {
  async run() {
    await Factory.get('activities').createMany(50)
  }
}

module.exports = ActivitySeeder
