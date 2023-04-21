"use strict";

const MemberKomprof = use("App/Models/MemberKomprof");
const Member = use("App/Models/Member");
const { validate } = use("Validator");
const Database = use("Database");
const Excel = require("exceljs");

const ROLE_KADER_KOMPROF = 53;
const ROLE_KADER_INVENTRA = 52;
const ROLE_KADER_KOMPROF_INDEX = 6;

class MemberKomprofController {
  async index({ params, request, response }) {
    try {
      const { komprof_id } = params;
      const data = request.all();
      const page = data.page ? data.page : 1;
      const perPage = data.perPage ? data.perPage : 10;
      const sortField = data.sortField ? data.sortField : "created_at";
      const sortDirection = data.sortDirection ? data.sortDirection : "desc";
      const participants = await MemberKomprof.getParticipants(
        { komprof_id },
        page,
        perPage,
        sortField,
        sortDirection
      );

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data peserta komprof berhasil dimuat!",
        data: participants,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async store({ params, request, response }) {
    try {
      const { komprof_id } = params;

      const data = request.all();

      const rules = {
        email: "required|email",
        batch: "required|number",
      };

      const validation = await validate(data, rules);

      if (validation.fails()) {
        return response.status(400).json({
          status: "FAILED",
          message: validation.messages(),
        });
      }

      const rawMember = await Member.query()
        .where("email", data.email)
        .with("member_role")
        .first();

      const member = rawMember.toJSON();
      if (!member.is_active) {
        return response.status(400).json({
          status: "FAILED",
          message: "Anggota tidak aktif!",
        });
      }

      if (member.member_role.index < ROLE_KADER_KOMPROF_INDEX) {
        rawMember.role_id = ROLE_KADER_KOMPROF;
        await rawMember.save();
      }

      const participant = new MemberKomprof();
      participant.komprof_id = Number(komprof_id);
      participant.member_id = member.id;
      participant.batch = data.batch;
      await participant.save();

      return response.status(200).json({
        status: "SUCCESS",
        message: "Peserta komprof berhasil ditambahkan!",
        data: participant,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async delete({ params, response }) {
    try {
      let { komprof_id, member_id } = params;
      komprof_id = Number(komprof_id);
      member_id = Number(member_id);

      const participant = await MemberKomprof.findBy({ komprof_id, member_id });
      if (!participant) {
        return response.status(400).json({
          status: "FAILED",
          message: "Peserta komprof tidak ditemukan!",
        });
      }

      await participant.delete();

      const member = await Member.find(member_id);
      if (!member) {
        return response.status(400).json({
          status: "FAILED",
          message: "Anggota tidak ditemukan!",
        });
      }

      const registeredKomprofOfMember = await MemberKomprof.query()
        .where({ member_id })
        .fetch();

      if (registeredKomprofOfMember.toJSON().length == 0) {
        member.role_id = ROLE_KADER_INVENTRA;
        await member.save();
      }

      return response.status(200).json({
        status: "SUCCESS",
        message: "Peserta komprof berhasil dihapus!",
        data: participant,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async import({ params, request, response }) {
    const trx = await Database.beginTransaction();

    try {
      let { komprof_id } = params;
      komprof_id = Number(komprof_id);
      const batch = Number(request.input("batch"));

      // Get file
      const fileOption = {
        types: ["xlsx"],
        size: "2mb",
      };
      const file = request.file("file", fileOption);

      // Read file
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(file.tmpPath);

      // Get worksheet
      const worksheet = workbook.getWorksheet(1);

      // get data
      const data = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          data.push(row.getCell(1).value);
        }
      });

      const members = await Member.query()
        .select("id")
        .whereIn("email", data)
        .fetch();

      const participants = [];
      members.toJSON().forEach((member) => {
        const participant = {
          komprof_id,
          member_id: member.id,
          batch: batch,
          created_at: new Date(),
          updated_at: new Date(),
        };
        participants.push(participant);
      });

      await trx.table("member_komprofs").insert(participants);

      const query = "UPDATE members SET role_id = ? WHERE id IN (?)";
      await trx.raw(query, [
        ROLE_KADER_KOMPROF,
        members.rows
          .filter((member) => member.role_id == ROLE_KADER_INVENTRA)
          .map((member) => member.id),
      ]);

      await trx.commit();

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data peserta komprof berhasil diimport!",
      });
    } catch (error) {
      console.log(error);
      await trx.rollback();
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }
}

module.exports = MemberKomprofController;
