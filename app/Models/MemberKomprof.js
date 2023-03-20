"use strict";

const Model = use("Model");

class MemberKomprof extends Model {
  static boot() {
    super.boot();
  }

  static get table() {
    return "member_komprofs";
  }
}

module.exports = MemberKomprof;
