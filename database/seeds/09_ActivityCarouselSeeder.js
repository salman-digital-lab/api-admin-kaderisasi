'use strict'

/*
|--------------------------------------------------------------------------
| ActivityCarouselSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

const Activities = use('App/Models/Activity')
const ActivityCarousel = use('App/Models/ActivityCarousel')

class ActivityCarouselSeeder {
  async run() {

    const activities = await Activities.all()

    for (const activity of activities.rows) {
      await Factory.model('App/Models/ActivityCarousel').createMany(50,{
        activity_id : activity.id
      })
    }
  }
}

module.exports = ActivityCarouselSeeder
