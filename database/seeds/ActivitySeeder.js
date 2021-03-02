'use strict'

/*
|--------------------------------------------------------------------------
| ActivitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ActivitySeeder {
  async run () {
    await Factory.get('activities').createMany(50)
  }
}

module.exports = ActivitySeeder
