'use strict'

/*
|--------------------------------------------------------------------------
| StudentCareSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')


const Member = use('App/Models/Member')
const User = use('App/Models/User')


class StudentCareSeeder {
  async run () {
    const members = await Member.all()
    const users = await User.all()

    await Factory.model('App/Models/StudentCare').createMany(30, {
      members : members,
      users: users
    })
  }
}

module.exports = StudentCareSeeder
