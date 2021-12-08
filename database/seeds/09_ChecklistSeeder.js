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
const Database = use('Database')
const MemberChecklist = use('App/Models/MemberChecklist')

class ChecklistSeeder {
  async run() {
    await Factory.model('App/Models/Checklist').createMany(20)
    const checklists = await Checklist.all()
    const members = await Member.all()

    // Should be n_members * 5.
    const data = []
    for (const member of members.rows)
    {
      for (const checklist of checklists.rows)
      {
        if (Math.random() > 0.5)
        {
          data.push({
            checklist_id : checklist.id,
            member_id : member.id
          })
        }
      }
    }

    await Database.insert(data).into(MemberChecklist.table)
  }
}

module.exports = ChecklistSeeder
