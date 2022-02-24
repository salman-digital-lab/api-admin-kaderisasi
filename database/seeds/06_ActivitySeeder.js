'use strict'

const Factory = use('Factory')

const Category = use('App/Models/ActivityCategory')
const MemberRole = use('App/Models/MemberRole')
const Activity = use('App/Models/Activity')
const ActivityCarousel = use('App/Models/ActivityCarousel')
const Database = use('Database')

class ActivitySeeder {
  async run () {
  	const categories = await Category.all()
  	const roles = await MemberRole.all()

    await Factory.model('App/Models/Activity').createMany(50, {
    	categories: categories,
    	roles: roles
    })

    const activities = await Activity.all()

    /** Banner seeding, not separated so that we always this with Activity Seeding */
    const banners = activities.rows.map(function (activity) {
      return [
        {
          activity_id: activity.id,
          filename: 'main.jpg'

        },
        {
          activity_id: activity.id,
          filename: 'banner1.jpg'
        },
        {
          activity_id: activity.id,
          filename: 'banner2.jpg'
        }
      ]
    })

    /** is flat available ? no */
    const reduced_banners = banners.reduce((acc, current) => {
      return acc.concat(current)
    })

    await Database.insert(reduced_banners).into(ActivityCarousel.table)
  }
}

module.exports = ActivitySeeder
