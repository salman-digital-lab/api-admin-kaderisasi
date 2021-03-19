'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use("Validator");
const ActivityFormTemplate = use("App/Models/ActivityFormTemplate");

/**
 * Resourceful controller for interacting with activityformtemplates
 */
class ActivityFormTemplateController {
  /**
   * Show a list of all activityformtemplates.
   * GET activityformtemplates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response }) {
    try {
      const form_templates = await ActivityFormTemplate.all();

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Template Formulir Aktivitas berhasil dimuat!",
          data: form_templates,
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

  /**
   * Create/save a new activityformtemplate.
   * POST activityformtemplates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

    const rules = {
      name: "required",
      body: "required"
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

        const { name, body } = request.all();

        const form_template = new ActivityFormTemplate();
        form_template.name = name;
        form_template.data = body;
        await form_template.save();

        const form_templates = await ActivityFormTemplate.findOrFail(form_template.id);

        return response
          .status(201)
          .json({
            status: "SUCCESS",
            message: "Data Template Formulir Aktivitas berhasil dibuat!",
            data: form_templates,
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

  /**
   * Display a single activityformtemplate.
   * GET activityformtemplates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {

      const { id } = params;
      const form_templates = await ActivityFormTemplate.find(id);

      if (form_templates) {
        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Template Formulir Aktivitas berhasil dimuat!",
            data: form_templates,
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

  /**
   * Update activityformtemplate details.
   * PUT or PATCH activityformtemplates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {

    const { id } = params;
    const form_template = await ActivityFormTemplate.find(id);

    if (form_template) {

      const data = request.all();

      const rules = {
        name: "required_if:name",
        body: "required_if:body"
      };

      const validation = await validate(data, rules);

      if (validation.fails()) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: validation.messages()
          });
      } else {

        if (data.name) {
          form_template.name = data.name;
        }

        if (data.body) {
          form_template.data = data.body;
        }

        await form_template.save();

        try {

          const form_templates = await ActivityFormTemplate.findOrFail(form_template.id);

          return response
            .status(200)
            .json({
              status: "SUCCESS",
              message: "Data Template Formulir Aktivitas berhasil diperbarui!",
              data: form_templates,
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

  /**
   * Delete a activityformtemplate with id.
   * DELETE activityformtemplates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {

    const { id } = params;
    const form_template = await ActivityFormTemplate.find(id);

    if (form_template) {
      try {
        await form_template.delete();
        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Template Formulir Aktivitas berhasil dihapus!",
            data: form_template,
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

module.exports = ActivityFormTemplateController
