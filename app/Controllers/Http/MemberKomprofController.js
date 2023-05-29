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
      const {
        page = 1,
        perPage = 10,
        sortField = "created_at",
        sortDirection = "desc",
      } = request.all();

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

      const member = await Member.find(member_id);
      if (!member) {
        return response.status(404).json({
          status: "FAILED",
          message: "Anggota tidak ditemukan!",
        });
      }

      const participant = await MemberKomprof.findBy({ komprof_id, member_id });
      if (!participant) {
        return response.status(404).json({
          status: "FAILED",
          message: "Peserta komprof tidak ditemukan!",
        });
      }

      await participant.delete();

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
      const { komprof_id } = params;
      const batch = Number(request.input("batch"));

      // Validate and read file
      const file = await this.validateAndReadFile(request);

      // Read worksheet data
      const data = await this.readWorksheetData(file);

      // Fetch member IDs
      const memberEmails = data.slice(1); // Exclude the header row
      const memberIds = await Member.query()
        .where("role_id", ROLE_KADER_INVENTRA)
        .whereIn("email", memberEmails)
        .pluck("id");

      if (memberIds.length > 0) {
        // Create participants
        const participants = memberIds.map((memberId) => ({
          komprof_id,
          member_id: memberId,
          batch,
          created_at: new Date(),
          updated_at: new Date(),
        }));

        await trx.table("member_komprofs").insert(participants);

        const query = "UPDATE members SET role_id = ? WHERE id IN (?)";
        await trx.raw(query, [ROLE_KADER_KOMPROF, memberIds]);
        await trx.commit();
      }

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data peserta komprof berhasil diimport!",
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        status: "FAILED",
        message: error.message,
      });
    }
  }

  async validateAndReadFile(request) {
    const fileOption = {
      types: ["xlsx"],
      size: "2mb",
    };
    const file = request.file("file", fileOption);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(file.tmpPath);

    return workbook;
  }

  async readWorksheetData(workbook) {
    const worksheet = workbook.getWorksheet(1);
    const data = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        data.push(row.getCell(1).value);
      }
    });

    return data;
  }
}

module.exports = MemberKomprofController;
