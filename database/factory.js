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

Factory.blueprint("activity_categories", (faker) => {
  const name = faker.username();
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
  };
});

Factory.blueprint("activities", async (faker) => {

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
