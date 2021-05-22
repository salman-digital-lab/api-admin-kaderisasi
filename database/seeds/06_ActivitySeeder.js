'use strict'

const Factory = use('Factory')

const Category = use("App/Models/ActivityCategory");
const MemberRole = use("App/Models/MemberRole");

class ActivitySeeder {
  async run() {
  	const categories = await Category.all()
  	const roles = await MemberRole.all()
  	
    await Factory.model('App/Models/Activity').createMany(50, {
    	categories : categories,
    	roles : roles
    })
  }
}

module.exports = ActivitySeeder
