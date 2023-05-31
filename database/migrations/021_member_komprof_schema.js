"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MemberKomprofSchema extends Schema {
  up() {
    this.create("member_komprofs", (table) => {
      table.increments();
      table.integer("member_id").unsigned();
      table
        .foreign("member_id")
        .references("id")
        .inTable("members")
        .onDelete("CASCADE");
      table.integer("komprof_id").unsigned();
      table
        .foreign("komprof_id")
        .references("id")
        .inTable("komprofs")
        .onDelete("CASCADE");
      table.unique(["member_id", "komprof_id"]);
      table.integer("batch").unsigned();
      table.timestamps();
    });
  }

  down() {
    this.drop("member_komprofs");
  }
}

module.exports = MemberKomprofSchema;
