"use strict";

const Model = use("Model");
const Database = use("Database");

class MemberKomprof extends Model {
  static boot() {
    super.boot();
  }

  static get table() {
    return "member_komprofs";
  }

  static async getParticipants(
    whereClause = {},
    page,
    perPage,
    sortField,
    sortDirection
  ) {
    const selected_fields = [
      "member_komprofs.*",
      "members.name",
      "members.gender",
      "members.email",
      "members.phone",
      "members.faculty",
      "members.major",
      "members.student_id",
      "members.intake_year",
      "members.role_id",
      "member_roles.name as role_name",
      "members.university_id",
      "university.name as university_name",
    ];

    const member_komprofs = await Database.select(selected_fields)
      .from("member_komprofs")
      .where(whereClause)
      .orderBy(sortField, sortDirection)
      .innerJoin("members", "members.id", "member_komprofs.member_id")
      .leftJoin("member_roles", "member_roles.id", "members.role_id")
      .leftJoin("university", "university.id", "members.university_id")
      .paginate(page, perPage);

    return member_komprofs;
  }

  member() {
    return this.hasOne("App/Models/Member", "member_id", "id");
  }

  komprof() {
    return this.belongsTo("App/Models/Komprof", "komprof_id", "id");
  }
}

module.exports = MemberKomprof;
