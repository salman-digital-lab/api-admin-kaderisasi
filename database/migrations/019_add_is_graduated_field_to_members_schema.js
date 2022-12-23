"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MembersSchema extends Schema {
  up() {
    this.table("members", (table) => {
      // alter table
      table.boolean("is_graduated").defaultTo(false);
    });
  }

  down() {
    this.table("members", (table) => {
      // reverse alternations
      table.dropColumn("is_graduated");
    });
  }
}

module.exports = MembersSchema;
