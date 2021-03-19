"use strict";

const { validate } = use("Validator");
const Category = use("App/Models/ActivityCategory");

class ActivityCategoryController {

  async index({ response }) {
    try {
      const categories = await Category.all();
      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Kategori Aktivitas berhasil dimuat!",
          data: categories,
        });
    } catch (error) {
      return response
        .status(400)
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
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    } else {
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
          .status(400)
          .json({
            status: "FAILED",
            message: error
          });
      }
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const categories = await Category.find(id);
      if (categories) {
        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Kategori Aktivitas berhasil dimuat!",
            data: categories,
          });
      } else {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Tidak ada data yang ditemukan"
          });
      }
    } catch (error) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async update({ params, request, response }) {

    const { id } = params;
    const category = await Category.find(id);

    if (category) {

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
      } else {

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
            .status(400)
            .json({
              status: "FAILED",
              message: error
            });
        }
      }
    } else {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }
  }

  async destroy({ params, response }) {

    const { id } = params;
    const category = await Category.find(id);

    if (category) {
      try {
        await category.delete();
        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Kategori Aktivitas berhasil dihapus!",
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
    } else {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }
  }
}

module.exports = ActivityCategoryController;
