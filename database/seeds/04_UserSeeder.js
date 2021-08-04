'use strict'

const Factory = use('Factory')
const User = use('App/Models/User')
const Database = use('Database')

class UserSeeder {
  async run () {
    await Factory.model('App/Models/User').createMany(20)
    await User.create({
      username: 'tes',
      email: 'tes@tes.tes',
      password: 'tes123',
      first_name: 'tes',
      last_name: '123'
    })

    // Now map user
    // For non-test user, map randomly
    // For test-user, map to admin (1)
    const users = await User.all()
    const user_groups = users.rows.map(function (user) {
      if (user.email == 'tes@tes.tes') {
        return {
          user_id: user.id,
          group_id: 1 // admin
        }
      }

      return {
        user_id: user.id,
        group_id: Math.floor(Math.random() * 4) + 1
      }
    })

    await Database.insert(user_groups).into('users_groups')
  }
}

module.exports = UserSeeder
