"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Komprof extends Model {
  static get table() {
    return "komprofs";
  }

  member_role() {
    return this.hasOne("App/Models/MemberKomprof", "komprof_id", "id");
  }
}

module.exports = Komprof;
