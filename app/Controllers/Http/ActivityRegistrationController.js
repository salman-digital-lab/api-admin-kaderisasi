'use strict'

const { validate } = use("Validator");
const ActivityRegistration = use("App/Models/ActivityRegistration");
const Activity = use("App/Models/Activity");
const Member = use("App/Models/Member");
const Database = use('Database')

class ActivityRegistrationController {

  async index({ params, response }) {

    const { activity_id } = params;
    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 })

    if (!activity) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Aktivitas tidak ditemukan"
        });
    }

    try {
      const activity_registrations = await ActivityRegistration.query()
        .where({ activity_id: activity_id })
        .with("member")
        .with('member.member_role')
        .fetch()

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Registrasi Aktivitas berhasil dimuat",
          data: activity_registrations,
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

    const data = request.all();
    const rules = {
      member_id: "required|number",
      activity_id: "required|number"
    };

    const validation = await validate({
      'member_id': data.member_id,
      'activity_id': data.activity_id
    }, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    const activity = await Activity.findBy({ id: data.activity_id, is_deleted: 0 })
    const member = await Member.findBy({ id: data.member_id })

    if (!activity) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Aktivitas tidak ditemukan"
        });
    }

    if (!member) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Member tidak ditemukan"
        });
    }

    if (member.role_id >= activity.minimum_role_id) {

      const is_already_register = await ActivityRegistration.findBy({
        'member_id': data.member_id,
        'activity_id': data.activity_id
      });

      if (is_already_register) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Anda sudah pernah mendaftar pada aktivitas atau kegiatan ini"
          });
      }

      try {

        const activity_registration = new ActivityRegistration();

        activity_registration.member_id = data.member_id;
        activity_registration.activity_id = data.activity_id;

        if (data.questionnaire) {
          activity_registration.questionnaire = data.questionnaire;
        }

        await activity_registration.save();

        const activity_registrations = await ActivityRegistration.findBy({
          'member_id': activity_registration.member_id,
          'activity_id': activity_registration.activity_id
        });

        return response
          .status(201)
          .json({
            status: "SUCCESS",
            message: `Anda berhasil mendaftar pada kegiatan ${activity.name}!`,
            data: {
              "activity_registrations": activity_registrations,
              "activity": activity
            }
          });
      } catch (error) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: error
          });
      }
    } else {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Anda tidak dapat mendaftar pada aktivitas atau kegiatan ini karena tidak memenuhi role atau level member yang ditentukan"
        });
    }
  }

  async show({ params, response }) {

    const { member_id, activity_id } = params;

    const activity_registrations = await ActivityRegistration.findBy({
      activity_id: activity_id,
      member_id: member_id
    })

    if (!activity_registrations) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }

    try {

      const activity_registration = await ActivityRegistration.query()
        .where({ activity_id: activity_id, member_id: member_id })
        .with("member")
        .with('member.member_role')
        .fetch()

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Registrasi Aktivitas berhasil dimuat!",
          data: activity_registration,
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

  async destroy({ params, response }) {

    const { member_id, activity_id } = params;
    const where_clauses = {
      'member_id': member_id,
      'activity_id': activity_id
    };

    const activity_registration = await ActivityRegistration.findBy(where_clauses);

    if (!activity_registration) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }

    try {

      await Database
        .table('activity_registrations')
        .where(where_clauses)
        .delete()

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Registrasi Aktivitas berhasil dihapus!",
          data: activity_registration,
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

module.exports = ActivityRegistrationController
