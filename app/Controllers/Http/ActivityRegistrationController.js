'use strict'

class ActivityRegistrationController {

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

  async store({ request, response }) {
  }

  async show({ params, request, response, view }) {
  }

  async update({ params, request, response }) {
  }

  async destroy({ params, request, response }) {
  }
}

module.exports = ActivityRegistrationController
