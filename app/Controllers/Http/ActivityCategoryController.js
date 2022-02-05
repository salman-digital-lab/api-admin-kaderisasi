"use strict";

const { validate } = use("Validator");
const Category = use("App/Models/ActivityCategory");

class ActivityCategoryController {

  async index({ request, response }) {
    try {
      const data = request.all();
      const page = data.page ? data.page : 1;
      const perPage = data.perPage ? data.perPage : 10;
      const sortField = data.sortField ? data.sortField : "created_at"
      const sortDirection = data.sortDirection ? data.sortDirection : "desc"
      const categories = await Category.query()
        .orderBy(sortField, sortDirection)
        .paginate(page, perPage);
        
      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Kategori Aktivitas berhasil dimuat!",
          data: categories,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async store({ request, response }) {
    const rules = {
      name: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    try {
      const { name } = request.all();
      const category = new Category();
      category.name = name;
      await category.save();

      const categories = await Category.findOrFail(category.id);

      return response
        .status(201)
        .json({
          status: "SUCCESS",
          message: "Data Kategori Aktivitas berhasil dibuat!",
          data: categories,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const categories = await Category.find(id);
      if (!categories) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Tidak ada data yang ditemukan"
          });

      }
      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Kategori Aktivitas berhasil dimuat!",
          data: categories,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async update({ params, request, response }) {

    const { id } = params;
    const category = await Category.find(id);

    if (!category) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }

    const rules = {
      name: "required",
    };

    const data = request.all();
    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    try {
      category.name = data.name;
      await category.save();

      const categories = await Category.find(category.id);

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Kategori Aktivitas berhasil diperbarui!",
          data: categories,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async setActive({ params, response }) {

    const { id } = params;
    const category = await Category.find(id);

    if (!category) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }

    try {
      const message = category.is_active ? "Data Kategori Aktivitas berhasil dinonaktifkan" : "Data Kategori Aktivitas berhasil diaktifkan";
      
      category.is_active = category.is_active ? false : true;
      await category.save();
      
      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message,
          data: category,
        });
    } catch (error) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: error.messages
        });
    }
  }
}

module.exports = ActivityCategoryController;
