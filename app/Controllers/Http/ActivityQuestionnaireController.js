'use strict'

const database = require("../../../config/database")

const Activity = use('App/Models/Activity')
const Database = use('Database')
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

  async getStatistics ({ params, request, response }) {
    const { activity_id } = params
    
    try {
      
      let questionnaire_data = await Database
        .select('id_name', 'answer')
        .count('* as count')
        .from('save_questionnaires')
        .leftJoin('activity_registrations', 'activity_registrations.id', 'save_questionnaires.id_registration')
        .where('activity_id', activity_id)
        .groupBy('id_name', 'answer');
      questionnaire_data = JSON.parse(JSON.stringify(questionnaire_data))

      const activity = (await Activity.findBy({ id: activity_id, is_deleted: 0 })).toJSON();

      const form_data = this.getActivityFormQuestion(activity);
      const extracted_data = this.extractQuestionnaireData(questionnaire_data);
      const statistics = this.buildQuestionnaireStatisticsResponse(form_data, extracted_data);

      response.status(200).json({
        status: "SUCCESS",
        message: "Berhasil mendapatkan data statistik kuesioner",
        data: statistics
      });
    } catch (error) {
        response.status(500).json({
          status: "FAILED",
          message: "Gagal mendapat data statistik kuesioner karena kegagalan server",
          error: error
        })
    }
  }

  getActivityFormQuestion(activity) {
    const form_data = JSON.parse(activity.form_data);
    const result = form_data.reduce((acc, cur) => {
      const data = cur.data
      acc[cur.name] = {
        label: cur.label
      }
      if (data) {
        acc[cur.name].data = data;
      }
      return acc;
    }, {})

    return result;
  }

  extractQuestionnaireData(questionnaire_data) {
    const extracted_data = {};
    questionnaire_data.forEach(data => {
      const question_id = data.id_name;
      const answer = data.answer;
      const count = data.count;
      if (extracted_data[question_id] == null) {
        extracted_data[question_id] = {}
      }

      extracted_data[question_id][answer] = count; 
    })

    return extracted_data;
  }

  buildQuestionnaireStatisticsResponse(form_data, extracted_data) {
    const response = {};
    Object.keys(form_data).forEach(key => {
      const form_key = key;
      const form_label = form_data[key].label;
      const data = form_data[key].data;
      
      response[form_label] = {}
      if (data) {
        data.forEach(data_item => {
          const data_label = data_item.label
          if (!extracted_data[form_key] || !extracted_data[form_key][data_label]) {
            response[form_label][data_label] = 0;
            return ;
          } 
          
          response[form_label][data_label] = extracted_data[form_key][data_label]
        })
      } else {
        if (!extracted_data[form_key]) {
          return ;
        }

        Object.keys(extracted_data[form_key]).forEach(value => {
          response[form_label][value] = extracted_data[form_key][value];
        })
      }
    });

    return response;
  }

}

module.exports = ActivityQuestionnaireController
