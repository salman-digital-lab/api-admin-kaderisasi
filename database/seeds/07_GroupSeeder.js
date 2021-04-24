'use strict'

const Factory = use('Factory')
const User = use('App/Models/User')
const Database = use('Database')

class GroupSeeder {
  async run() {
    const group = await Factory.model('App/Models/Group').create()
    const users = await User.all()
    const users_groups = users.rows.map(function(user) {
		return {user_id : user.id, group_id : group.id}
    })

    await Database.insert(users_groups).into('users_groups')
  }
}

module.exports = GroupSeeder
