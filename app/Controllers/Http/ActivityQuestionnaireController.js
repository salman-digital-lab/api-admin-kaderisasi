'use strict'

const Activity = use("App/Models/Activity");
const FormValidator = require('../../Validator/FormValidator')

class ActivityQuestionnaireController {

  async index ({ params, response }) {
    const id = params.activity_id
    try {
      var data = await Activity.query().select('form_data').where('id', id).fetch()

      var formData = data.toJSON()
      formData = JSON.parse(formData[0]["form_data"])

      if (formData === null) {
        formData = []
      }
      
      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Kuisioner Aktivitas berhasil dimuat!",
          data: formData
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

  async update ({ params, request, response }) {
    var data = request.all()
    const activityId = params.activity_id

    try {

      const activity = await Activity.find(activityId)

      if (!activity) {
        return response
        .status(404)
        .json({
          status: "SUCCESS",
          message: "Aktivitas tidak ditemukan"
        })
      }

      data = Object.values(data)
      FormValidator.validate(data)
      var dataJson = JSON.stringify(data)
      
      activity.merge({form_data: dataJson})
      await activity.save()
      
      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Kuisioner Aktivitas berhasil diunggah!",
          data: data
        })

    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error.message
        })
    }
  }

}

module.exports = ActivityQuestionnaireController
