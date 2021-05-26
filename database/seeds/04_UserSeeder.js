'use strict'

const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run() {
    await Factory.model('App/Models/User').createMany(20);
    await User.create({
      username: 'tes',
      email: 'tes@tes.tes',
      password: 'tes123',
      first_name: 'tes',
      last_name: '123'
    });
  }
}

module.exports = UserSeeder
