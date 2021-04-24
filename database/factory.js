"use strict";

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
const Factory = use("Factory");
const Category = use("App/Models/ActivityCategory");

Factory.blueprint("App/Models/ActivityCategory", (faker) => {
  const name = faker.username();
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
  };
});

Factory.blueprint('App/Models/University', (faker) => {
  return {
    name : "University of ".concat(faker.city())
  }
})

Factory.blueprint("App/Models/Activity", async (faker) => {

  const categories = await Category.all();
  const name = faker.sentence();

  return {
    name: name,
    slug: name.toLowerCase().split(" ").join("-"),
    description: faker.text,
    begin_date: faker.date(),
    end_date: faker.date(),
    register_begin_date: faker.date(),
    register_end_date: faker.date(),
    category_id: categories.toJSON()[Math.floor(Math.random() * categories.toJSON().length)].id,
  };
});

Factory.blueprint("App/Models/User", async (faker) => {
  const first_name = faker.first()
  const last_name = faker.last()

  return {
    username: faker.username(),
    email : faker.email(),
    password: "example",
    first_name: first_name,
    last_name : last_name,
    display_name : first_name + " " + last_name,
    salt: faker.string({length: 255})
  }
})

Factory.blueprint('App/Models/Member', (faker, index, data) => {

  const birthday_year = faker.integer({min: 1990, max: 1999})
  const birthday_month = faker.integer({min: 1, max: 12})
  const birthday_day = faker.integer({min: 1, max: 20})
  const university  = faker.pickone(data.universities.rows)
  const village = faker.pickone(data.villages.rows)

  // Note : Very LUCKILY we can infer the province, regency, district id solely from village id
  // We need to fix this
  return {
    name: faker.name(),
    gender: faker.pickone(['M', 'F']),
    email: faker.email(),
    line_id: "@" + faker.string({alpha: true, numeric: true}),
    date_of_birthday: birthday_year + "-" + birthday_month + "-" + birthday_day,
    city_of_birth: faker.city(),
    from_address: faker.address(),
    current_address: faker.address(),
    faculty: faker.pickone(['Medicine', 'Humanitarian Studies', 'Engineering']),
    major: faker.pickone(["Mathematics, Politics, Law"]),
    student_id: faker.string({numeric: true, length: 12}),
    intake_year: faker.pickone([2016, 2017, 2018, 2019, 2020]),
    role_id: faker.pickone([4,5,6,7]),
    password: "example",
    university_id: university.id,
    province_id: village.id.substring(0,2),
    regency_id: village.id.substring(0,4),
    district_id: village.id.substring(0,7),
    village_id: village.id
  }
})

Factory.blueprint("App/Models/Group", (faker) => {
  return {
    name: "admin",
    shortname : "adm",
    description : "administrator",
    is_admin: true
  }
})
