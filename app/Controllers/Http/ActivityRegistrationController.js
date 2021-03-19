'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use("Validator");
const ActivityRegistration = use("App/Models/ActivityRegistration");

/**
 * Resourceful controller for interacting with activityregistrations
 */
class ActivityRegistrationController {
  /**
   * Show a list of all activityregistrations.
   * GET activityregistrations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, response }) {
    try {

      const { activity_id } = params;
      const activity_registrations = await ActivityFormTemplate.findBy('activity_id', activity_id);

      if (activity_registrations) {
        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Registrasi Aktivitas berhasil dimuat!",
            data: activity_registrations,
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
   * Create/save a new activityregistration.
   * POST activityregistrations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single activityregistration.
   * GET activityregistrations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Update activityregistration details.
   * PUT or PATCH activityregistrations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a activityregistration with id.
   * DELETE activityregistrations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = ActivityRegistrationController
