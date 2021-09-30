'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Category = use('App/Models/ActivityCategory')
const MemberRole = use('App/Models/MemberRole')
const QuestionnaireSeedingHelper = require('./helpers/QuestionnaireSeedingHelper')

Factory.blueprint('App/Models/ActivityCategory', (faker) => {
  const name = faker.username()
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1)
  }
})

Factory.blueprint('App/Models/University', (faker) => {
  return {
    name: 'University of '.concat(faker.city())
  }
})

Factory.blueprint('App/Models/Activity', async (faker, index, data) => {
  const name = faker.sentence()
  const form_data = QuestionnaireSeedingHelper.formObject

  return {
    name: name,
    slug: name.toLowerCase().split(' ').join('-'),
    description: faker.text,
    begin_date: faker.date(),
    end_date: faker.date(),
    minimum_role_id: faker.pickone(data.roles.rows).id,
    register_begin_date: faker.date({year: 2021, month: 1}),
    register_end_date: faker.date({year: 2021, month: faker.integer{min: 1, max: 10}}),
    category_id: faker.pickone(data.categories.rows).id,
    form_data: JSON.stringify(form_data)
  }
})

Factory.blueprint('App/Models/User', async (faker) => {
  const first_name = faker.first()
  const last_name = faker.last()

  return {
    username: faker.username(),
    email: faker.email(),
    password: 'example',
    first_name: first_name,
    last_name: last_name,
    display_name: first_name + ' ' + last_name,
    salt: faker.string({ length: 255 })
  }
})

Factory.blueprint('App/Models/Member', (faker, index, data) => {
  const birthday_year = faker.integer({ min: 1990, max: 1999 })
  const birthday_month = faker.integer({ min: 1, max: 12 })
  const birthday_day = faker.integer({ min: 1, max: 20 })
  const university = faker.pickone(data.universities.rows)
  const village = faker.pickone(data.villages.rows)
  const role = faker.pickone(data.roles.rows)

  // Note : Very LUCKILY we can infer the province, regency, district id solely from village id
  // We need to fix this
  return {
    name: faker.name(),
    gender: faker.pickone(['M', 'F']),
    email: faker.email(),
    phone: faker.phone(),
    line_id: '@' + faker.string({ alpha: true, numeric: true }),
    date_of_birthday: birthday_year + '-' + birthday_month + '-' + birthday_day,
    city_of_birth: faker.city(),
    from_address: faker.address(),
    current_address: faker.address(),
    faculty: faker.pickone(['Medicine', 'Humanitarian Studies', 'Engineering']),
    major: faker.pickone(['Mathematics, Politics, Law']),
    student_id: faker.string({ numeric: true, length: 12 }),
    intake_year: faker.pickone([2016, 2017, 2018, 2019, 2020]),
    role_id: role.id,
    password: 'example',
    university_id: university.id,
    province_id: village.id.substring(0, 2),
    regency_id: village.id.substring(0, 4),
    district_id: village.id.substring(0, 7),
    village_id: village.id,
    salt: faker.string({ length: 12 })
  }
})

Factory.blueprint('App/Models/ActivityCarousel', (faker, index, data) => {
  return {
    filename: 'carousel_dummy.jpg',
    activity_id: data.activity_id
  }
})

Factory.blueprint('App/Models/Class', (faker) => {
  return {
    title: faker.sentence({ words: 3 }),
    description: faker.sentence({ words: 10 })
  }
})

Factory.blueprint('App/Models/ClassSection', (faker, index, data) => {

  const kelas = faker.pickone(data.kelas.rows)

  return {
    title: faker.sentence({ words: 2 }),
    class_id: kelas.id
  }
})

Factory.blueprint('App/Models/ClassSectionVideo', (faker, index, data) => {

  const section = faker.pickone(data.sections.rows)

  return {
    title: faker.sentence({ words: 2 }),
    link: faker.url({ domain: 'www.youtube.com' }),
    section_id: section.id
  }
})
Factory.blueprint('App/Models/Checklist', (faker) => {
  return {
    checklist_name: faker.username()
  }
})

Factory.blueprint('App/Models/MemberChecklist', (faker, index, data) => {

  const member = faker.pickone(data.members.rows)
  const checklist = faker.pickone(data.checklists.rows)

  return {
    member_id: member.id,
    checklist_id: checklist.id
  }
})
