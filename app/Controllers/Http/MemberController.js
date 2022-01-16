"use strict";

const { rule, validate, sanitize } = use("Validator");
const { ModelNotFoundException } = require("@adonisjs/lucid/src/Exceptions");

const ActivityRegistration = use("App/Models/ActivityRegistration");
const Member = use("App/Models/Member");
class MemberController {
  async getMembers({ response, request }) {
    const params = request.get();

    const rules = {
      gender: [rule("regex", /^(M$|F$)/)],
      page: "number",
      page_size: "number",
      date_of_birthday: "date",
      search_query: "string",
      ssc: "number",
      lmd: "number",
    };

    const validation = await validate(params, rules);

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    const gender = params.gender || "";
    const page = params.page || 1;
    const page_size = params.page_size || 20;
    const dateOfBirthday = params.date_of_birthday || "";
    const ssc = params.ssc;
    const lmd = params.lmd;
    const searchQuery = params.search_query || "";

    try {
      let members = (await Member.query()
        .select([
          "members.*",
          "universities.name AS university",
          "member_roles.name AS role_name",
          "member_roles.description AS role_description",
        ])
        .from("members")
        .leftJoin("universities", "members.university_id", "universities.id")
        .leftJoin("member_roles", "members.role_id", "member_roles.id")
        .where(function () {
          this.where("members.name", "LIKE", `%${searchQuery}%`)
            .orWhere("city_of_birth", "LIKE", `%${searchQuery}%`)
            .orWhere("email", "LIKE", `%${searchQuery}%`)
            .orWhere("from_address", "LIKE", `%${searchQuery}%`)
            .orWhere("current_address", "LIKE", `%${searchQuery}%`)
            .orWhere("universities.name", "LIKE", `%${searchQuery}%`)
            .orWhere("major", "LIKE", `%${searchQuery}%`)
            .orWhere("faculty", "LIKE", `%${searchQuery}%`)
            .orWhere("line_id", "LIKE", `%${searchQuery}%`);
        })
        .andWhere("gender", "LIKE", `%${gender}%`)
        .andWhere("date_of_birthday", "LIKE", `%${dateOfBirthday}%`)
        .andWhere(function () {
          if (ssc) {
            this.whereNotNull("ssc").andWhere("ssc", "LIKE", `%${ssc}%`);
          }
        })
        .andWhere(function () {
          if (lmd) {
            this.whereNotNull("lmd").andWhere("lmd", "LIKE", `%${lmd}%`);
          }
        })
        .paginate(page, page_size))
        .toJSON();

      members = {
        ...members,
        data: members.data.map(member => {
          return {
            ...member,
            komprof: member.komprof ? member.komprof.split(",") : []
          }
        })
      }

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mendapatkan data member",
        data: members,
      });
    } catch (error) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal mendapatkan data member karena kesalahan server",
      });
    }
  }

  async getMember({ params, response }) {
    try {
      let member = (await Member.query()
        .select([
          "members.*",
          "universities.name AS university",
          "member_roles.name AS role_name",
          "region_provinces.name as province_name",
          "region_regencies.name as regency_name",
          "region_districts.name as district_name",
          "region_villages.name as village_name"
        ])
        .leftJoin("universities", "members.university_id", "universities.id")
        .leftJoin("member_roles", "members.role_id", "member_roles.id")
        .leftJoin(
          "region_provinces",
          "members.province_id",
          "region_provinces.id"
        )
        .leftJoin(
          "region_regencies",
          "members.regency_id",
          "region_regencies.id"
        )
        .leftJoin(
          "region_districts",
          "members.district_id",
          "region_districts.id"
        )
        .leftJoin("region_villages", "members.village_Id", "region_villages.id")
        .where("members.id", params.id)
        .fetch())
        .toJSON()[0];

      member = {
        ...member,
        komprof: member.komprof ? member.komprof.split(',') : []
      }

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mendapatkan data member",
        data: {
          member,
        },
      });
    } catch (err) {
      if (err instanceof ModelNotFoundException) {
        response.status(404).json({
          status: "FAILED",
          message: "Gagal mendapatkan data member karena data tidak ditemukan",
        });
      } else {
        response.status(500).json({
          status: "FAILED",
          message: "Gagal mendapatkan data member karena kesalahan server",
        });
      }
    }
  }

  async getMemberActivities({ params, response }) {
    try {
      const activities = await ActivityRegistration.query()
        .leftJoin(
          "activities",
          "activity_registrations.activity_id",
          "activities.id"
        )
        .leftJoin(
          "activity_categories",
          "activities.category_id",
          "activity_categories.id"
        )
        .where("member_id", params.id)
        .select("activities.name", "activities.begin_date")
        .select("activity_categories.name as category_name")
        .select("activity_registrations.status")
        .fetch();

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mendapatkan data aktivitas member",
        data: {
          activities,
        },
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message:
          "Gagal mendapatkan data aktivitas member karena kesalahan server",
      });
    }
  }

  async blockMember({ params, response }) {
    try {
      const member = await Member.find(params.id);
      if (member.is_active) {
        member.is_active = false;
      } else {
        response.status(400).json({
          status: "FAILED",
          message: "Gagal memblokir member karena member berstatus tidak aktif",
        });
        return;
      }

      await member.save();

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil memblokir member",
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal memblokir member karena kesalahan server",
      });
    }
  }

  async unblockMember({ params, response }) {
    try {
      const member = await Member.find(params.id);
      if (!member.is_active) {
        member.is_active = true;
      } else {
        response.status(400).json({
          status: "FAILED",
          message: "Gagal memblokir member karena member berstatus aktif",
        });
        return;
      }

      await member.save();

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mengaktifkan member",
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal mengaktifkan member karena kesalahan server",
      });
    }
  }

  async updateMember({ params, request, response }) {
    const all = request.all();

    const rules = {
      gender: [rule("regex", /^(M$|F$)/)],
      date_of_birthday: "date",
      name: "string",
      email: "email",
      phone: "string",
      line_id: "string",
      from_address: "string",
      current_address: "string",
      major: "string",
      university_id: "number",
      faculty: "string",
      ssc: "number",
      lmd: "number",
      role_id: "number",
      komprof: "string"
    };

    const validation = await validate(all, rules);

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    const sanitationRules = {
      date_of_birthday: "to_date",
      major: "title",
      name: "title",
      faculty: "title",
      university_id: "to_int",
      ssc: "to_int",
      lmd: "to_int",
      role_id: "to_int",
    };

    const data = sanitize(all, sanitationRules);

    try {
      const member = await Member.findByOrFail("id", params.id);

      Object.keys(data).forEach((column) => {
        member.merge({
          [column]: data[column],
        });
      });

      await member.save();

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mengubah data member",
        data: member,
      });
    } catch (err) {
      if (err instanceof ModelNotFoundException) {
        response.status(404).json({
          status: "FAILED",
          message: "Gagal mengubah data member karena data tidak ditemukan",
        });
      } else {
        response.status(500).json({
          status: "FAILED",
          message: "Gagal mengubah data member karena kesalahan server",
        });
      }
    }
  }
}

module.exports = MemberController;
