"use strict";

const Komprof = use("App/Models/Komprof");
const { validate } = use("Validator");

class KomprofController {
  async index({ request, response }) {
    try {
      const data = request.all();
      const page = data.page ? data.page : 1;
      const perPage = data.perPage ? data.perPage : 10;
      const sortField = data.sortField ? data.sortField : "created_at";
      const sortDirection = data.sortDirection ? data.sortDirection : "desc";
      const komprofs = await Komprof.query()
        .orderBy(sortField, sortDirection)
        .paginate(page, perPage);

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Komprof berhasil dimuat!",
        data: komprofs,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async show({ params, response }) {
    const { id } = params;
    try {
      let komprof = await Komprof.findOrFail(id);

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Komprof berhasil dimuat!",
        data: komprof,
      });
    } catch (error) {
      if (error.name === "ModelNotFoundException") {
        return response.status(404).json({
          status: "FAILED",
          message: "Data Komprof tidak ditemukan",
        });
      }

      return response.status(500).json({
        status: "FAILED",
        message: error.message,
      });
    }
  }

  async store({ request, response }) {
    const rules = {
      program_name: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    try {
      const { program_name, program_desc } = request.all();
      let komprof = new Komprof();
      komprof.program_name = program_name;
      komprof.program_desc = program_desc;
      komprof.is_active = 1;
      await komprof.save();

      komprof = await Komprof.findOrFail(komprof.id);

      return response.status(201).json({
        status: "SUCCESS",
        message: "Data Komprof berhasil dibuat!",
        data: komprof,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async update({ params, request, response }) {
    const { id } = params;
    try {
      let komprof = await Komprof.findOrFail(id);

      const data = request.all();

      if (data.program_name) {
        komprof.program_name = data.program_name;
      }
      if (data.program_desc) {
        komprof.program_desc = data.program_desc;
      }
      if (data.is_active !== undefined) {
        komprof.is_active = data.is_active;
      }

      await komprof.save();

      komprof = await Komprof.find(id);

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Komprof berhasil diperbarui!",
        data: komprof,
      });
    } catch (error) {
      if (error.name === "ModelNotFoundException") {
        return response.status(404).json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan",
        });
      }

      return response.status(500).json({
        status: "FAILED",
        message: error.message,
      });
    }
  }
}

module.exports = KomprofController;
