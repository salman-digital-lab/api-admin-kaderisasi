"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class KomprofSchema extends Schema {
  up() {
    this.create("komprofs", (table) => {
      table.increments();
      table.string("program_name", 255).notNullable();
      table.text("program_desc");
      table.boolean("is_active").notNullable().defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("komprofs");
  }
}

module.exports = KomprofSchema;
