'use strict'

const Factory = use('Factory')
const Village = use('App/Models/Region/Village')
const Universities = use('App/Models/University')
const MemberRole = use('App/Models/MemberRole')

class MemberSeeder {
  async run () {
    const villages = await Village.all()
    const universities = await Universities.all()
    const roles = await MemberRole.all()
    await Factory.model('App/Models/Member').createMany(100, {
      universities: universities,
      villages: villages,
      roles: roles
    })
  }
}

module.exports = MemberSeeder
