'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')
const Activity = use('App/Models/Activity')

class CloseRegistration extends Command {
  static get signature () {
    return 'close-registration'
  }

  static get description () {
    return 'Set activity registration status as closed'
  }

  async handle (args, options) {
    var slugContainers = [] // variable to store activity's unique field
    try {
      // get activities with status = OPENED
      var activities = await Activity
          .query()
          .select('slug', 'register_end_date', 'status')
          .where('status', 'OPENED')
          .fetch()

      activities = activities.toJSON()
      if (activities[0] != undefined) {
        // get the slugs of OPENED activities that should be closed on current date
        activities.forEach(element => {
          var registerEndDate = Date.parse(element.register_end_date)
          var todayDate = new Date().setHours(0,0,0,0)
          
          if (todayDate > registerEndDate) {
            slugContainers.push(element.slug)
          }
        });

        // update the status as CLOSED
        for(let i=0; i<slugContainers.length; i++) {
          await Activity
            .query()
            .where('slug', slugContainers[i])
            .update({status: 'CLOSED'})
        }

        console.log(slugContainers.length, `activities have been updated.`)
      }

    } catch (error) {
      console.log(error.message)
    }
    Database.close()
  }
}

module.exports = CloseRegistration
