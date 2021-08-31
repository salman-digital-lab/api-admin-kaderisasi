'use strict'

/*
|--------------------------------------------------------------------------
| ChecklistSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Member = use('App/Models/Member')
const Checklist = use('App/Models/Checklist')

class ChecklistSeeder {
  async run() {
    await Factory.model('App/Models/Checklist').createMany(10)
    const checklists = await Checklist.all()
    const members = await Member.all()

    await Factory.model('App/Models/MemberChecklist').createMany(30, {
      members: members,
      checklists: checklists
    })
  }
}

module.exports = ChecklistSeeder
