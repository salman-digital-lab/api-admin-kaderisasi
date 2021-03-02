"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use("Validator");
const Category = use("App/Models/ActivityCategory");

/**
 * Resourceful controller for interacting with activitycategories
 */
class ActivityCategoryController {
  /**
   * Show a list of all activitycategories.
   * GET activitycategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response }) {
    try {
      const categories = await Category.all();
      return response.json({
        message: "success",
        status: true,
        data: categories,
      });
    } catch (error) {
      return response.json({
        message: "error",
        status: false,
        error: error,
      });
    }
  }

  /**
   * Create/save a new activitycategory.
   * POST activitycategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const rules = {
      name: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.json({
        message: "error",
        status: false,
        error: validation.messages(),
      });
    } else {
      try {
        const { name } = request.all();
        const category = new Category();
        category.name = name;

        await category.save();

        const categories = await Category.findOrFail(category.id);

        return response.json({
          message: "success",
          status: true,
          data: categories,
        });
      } catch (error) {
        return response.json({
          message: "error",
          status: false,
          error: error,
        });
      }
    }
  }

  /**
   * Display a single activitycategory.
   * GET activitycategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const { id } = params;
      const categories = await Category.find(id);
      if (categories) {
        return response.json({
          message: "success",
          status: true,
          data: categories,
        });
      } else {
        return response.json({
          message: "error",
          status: false,
          error: "Tidak ada data yang ditemukan",
        });
      }
    } catch (error) {
      return response.json({
        message: "error",
        status: false,
        error: error,
      });
    }
  }

  /**
   * Update activitycategory details.
   * PUT or PATCH activitycategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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
        return response.json({
          message: "error",
          status: false,
          error: validation.messages(),
        });
      } else {

        try {

          category.name = data.name;
          await category.save();

          const categories = await Category.find(category.id);

          return response.json({
            message: "success",
            status: true,
            data: categories,
          });
        } catch (error) {
          return response.json({
            message: "error",
            status: false,
            error: error,
          });
        }
      }
    } else {
      return response.json({
        message: "error",
        status: false,
        error: "Tidak ada data yang ditemukan",
      });
    }
  }

  /**
   * Delete a activitycategory with id.
   * DELETE activitycategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {

    const { id } = params;
    const category = await Category.find(id);

    if (category) {
      try {
        await category.delete();
        return response.json({
          message: "success",
          status: true,
          data: category,
        });
      } catch (error) {
        return response.json({
          message: "error",
          status: false,
          error: error.messages,
        });
      }
    } else {
      return response.json({
        message: "error",
        status: false,
        error: "Tidak ada data yang ditemukan",
      });
    }
  }
}

module.exports = ActivityCategoryController;
