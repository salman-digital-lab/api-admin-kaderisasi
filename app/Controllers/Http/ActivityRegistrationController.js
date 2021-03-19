'use strict'

const { validate } = use("Validator");
const ActivityRegistration = use("App/Models/ActivityRegistration");
const Activity = use("App/Models/Activity");
const Database = use('Database')

class ActivityRegistrationController {

  async index({ params, response }) {

    try {

      const { activity_id } = params;
      const activity_registrations = await Database.from('activity_registrations').where('activity_id', activity_id);

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
    } else {

      const activity = await Activity.findBy({ id: data.activity_id, is_deleted: 0 })

      if (activity) {

        // Role ID adalah field yang terdapat pada tabel members
        //   Ini tentukan manual karena belum diintegrasikan dengan services members
        //   Role ID akan digunakan untuk mengecek "minimal role ID" pada tabel activity
        //   Sebagai ketentuan yang harus dipenuhi ketika akan mendaftar suatu aktivity  

        const role_id = 1;

        if (role_id >= activity.minimum_role_id) {

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
          } else {
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
          }
        } else {
          return response
            .status(400)
            .json({
              status: "FAILED",
              message: "Anda tidak dapat mendaftar pada aktivitas atau kegiatan ini karena tidak memenuhi Role yang ditentukan"
            });
        }
      } else {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Tidak ada data Aktivitas yang ditemukan"
          });
      }
    }
  }

  async show({ params, response }) {

    try {

      const { member_id, activity_id } = params;
      const activity_registrations = await ActivityRegistration.findBy({
        'member_id': member_id,
        'activity_id': activity_id
      });

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

  async destroy({ params, response }) {

    const { member_id, activity_id } = params;
    const where_clauses = {
      'member_id': member_id,
      'activity_id': activity_id
    };

    const activity_registration = await ActivityRegistration.findBy(where_clauses);

    if (activity_registration) {

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

module.exports = ActivityRegistrationController
