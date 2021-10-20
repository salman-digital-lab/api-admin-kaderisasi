'use strict'

/*
|--------------------------------------------------------------------------
| ClassSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Class = use('App/Models/Class')
const ClassSection = use('App/Models/ClassSection')

class ClassSeeder {
  async run() {
    await Factory.model('App/Models/Class').createMany(10)
    const kelas = await Class.all()

    await Factory.model('App/Models/ClassSection').createMany(20, {
      kelas: kelas
    })

    const sections = await ClassSection.all()

    await Factory.model('App/Models/ClassSectionVideo').createMany(20, {
      sections: sections
    })

  }
}

module.exports = ClassSeeder
