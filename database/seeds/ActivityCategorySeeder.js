'use strict'

/*
|--------------------------------------------------------------------------
| ActivityCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ActivityCategorySeeder {
  async run () {
    await Factory.get('activity_categories').createMany(10)
  }
}

module.exports = ActivityCategorySeeder
