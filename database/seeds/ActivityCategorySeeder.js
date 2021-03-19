'use strict'

const Factory = use('Factory')

class ActivityCategorySeeder {
  async run() {
    await Factory.get('activity_categories').createMany(10)
  }
}

module.exports = ActivityCategorySeeder
