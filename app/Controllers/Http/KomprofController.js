"use strict";

const Komprof = use("App/Models/Komprof");
const { rule, validate, sanitize } = use("Validator");
const { ModelNotFoundException } = require("@adonisjs/lucid/src/Exceptions");
const ActivityRegistration = use("App/Models/ActivityRegistration");

const Env = use("Env");

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

  async store({ request, response }) {
    const rules = {
      program_name: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(500).json({
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
    let komprof = await Komprof.find(id);

    if (!komprof) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data yang ditemukan",
      });
    }

    const data = request.all();

    try {
      if (data.program_name) {
        komprof.program_name = data.program_name;
      }
      if (data.program_desc) {
        komprof.program_desc = data.program_desc;
      }
      if (data.is_active != null) {
        komprof.is_active = data.is_active;
      }

      await komprof.save();

      komprof = await Komprof.find(komprof.id);

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Komprof berhasil diperbarui!",
        data: komprof,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }
}

module.exports = KomprofController;
