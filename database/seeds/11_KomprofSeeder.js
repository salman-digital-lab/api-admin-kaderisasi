"use strict";

/*
|--------------------------------------------------------------------------
| KomprofSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

class KomprofSeeder {
  async run() {
    await Factory.model("App/Models/Komprof").createMany(10);
  }
}

module.exports = KomprofSeeder;
