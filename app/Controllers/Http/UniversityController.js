"use strict";

const University = use("App/Models/University");
const { validate } = use("Validator");

class UniversityController {
  async getUniversities({ request, response }) {
    try {
      const data = request.all();
      const page = data.page ? data.page : 1;
      const perPage = data.perPage ? data.perPage : 10;
      const sortField = data.sortField ? data.sortField : "created_at"
      const sortDirection = data.sortDirection ? data.sortDirection : "desc"
      const universities = await University.query()
        .orderBy(sortField, sortDirection)
        .paginate(page, perPage);

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mendapatkan data universitas",
        data: universities,
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal mendapatkan data universitas karena kesalahan server",
      });
    }
  }

  async createUniversity({ request, response }) {
    const rules = {
      name: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      response.status(400).json({
        status: "FAILED",
        message:
          "Gagal menambahkan universitas. Harap memasukkan nama universitas",
      });
    }

    try {
      const data = request.only(["name"]);
      const university = await University.create(data);
      response.status(201).json({
        status: "SUCCESS",
        message: "Berhasil menambahkan universitas",
        data: university,
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal menambahkan universitas karena kesalahan server",
      });
    }
  }

  async updateUniversity({ params, request, response }) {
    const rules = {
      name: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      response.status(400).json({
        status: "FAILED",
        message:
          "Gagal mengubah data universitas. Harap memasukkan nama universitas",
      });
    }

    const body = validation._data;

    try {
      const university = await University.find(params.id);
      university.name = body.name;
      await university.save();
      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mengubah data universitas",
        data: university,
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal mengubah data universitas karena kesalahan server",
      });
    }
  }

  async deleteUniversity({ params, response }) {
    try {
      const university = await University.find(params.id);
      await university.delete();
      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil menghapus universitas",
        data: university,
      });
    } catch (err) {
      response.status(500).json({
        status: "FAILED",
        message: "Gagal menghapus universitas karena kesalahan server",
      });
    }
  }
}

module.exports = UniversityController;
