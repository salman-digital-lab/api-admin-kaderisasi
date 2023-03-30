"use strict";

const { validate, rule, sanitizor } = use("Validator");
const ActivityRegistration = use("App/Models/ActivityRegistration");
const Activity = use("App/Models/Activity");
const SaveQuestionnaire = use("App/Models/SaveQuestionnaire");
const Excel = require("exceljs");
const { NULL } = require("mysql/lib/protocol/constants/types");

class ActivityParticipanController {
  async show({ params, response }) {
    const { registration_id } = params;

    const rules = {
      registration_id: "number",
    };

    const validation = await validate(
      { registration_id: registration_id },
      rules
    );

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    const activity_registration = await ActivityRegistration.find(
      registration_id
    );

    if (!activity_registration) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data yang ditemukan",
      });
    }

    try {
      const activity_registrations = await ActivityRegistration.query()
        .where({ id: registration_id })
        .with("member")
        .with("member.member_role")
        .fetch();

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Registrasi Aktivitas berhasil dimuat!",
        data: activity_registrations,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async update_status({ params, response }) {
    const data = params;
    const registrationStatus = await ActivityRegistration.registrationStatus();

    const rules = {
      registration_id: "required|number",
      status: [rule("in", registrationStatus)],
    };

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    const activity_registration = await ActivityRegistration.find(
      data.registration_id
    );

    if (!activity_registration) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data yang ditemukan",
      });
    }

    try {
      await ActivityRegistration.query()
        .where("id", data.registration_id)
        .update({ status: data.status });

      const activity_registrations = await ActivityRegistration.find(
        data.registration_id
      );

      return response.status(200).json({
        status: "SUCCESS",
        message: "Status Partisipan berhasil diperbarui!",
        data: [activity_registrations],
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async show_questionnaire({ params, response }) {
    const { registration_id } = params;

    const rules = {
      registration_id: "required|number",
    };

    const validation = await validate(
      {
        registration_id: registration_id,
      },
      rules
    );

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    const activity_registration = await ActivityRegistration.find(
      registration_id
    );

    if (!activity_registration) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data yang ditemukan",
      });
    }

    try {
      const activity = await Activity.findBy({
        id: activity_registration.activity_id,
        is_deleted: 0,
      });
      if (!activity) {
        return response.status(400).json({
          status: "FAILED",
          message: "Tidak ada data aktivitas yang ditemukan",
        });
      }

      const questionnaire = JSON.parse(activity.toJSON().form_data);
      if (!questionnaire) {
        return response.status(400).json({
          status: "FAILED",
          message: "Aktivitas ini tidak memiliki kuisioner",
        });
      }

      const data = [];
      const questionnaire_answers = await SaveQuestionnaire.query()
        .where("id_registration", activity_registration.id)
        .fetch();

      if (questionnaire_answers.rows.length < 1) {
        return response.status(400).json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan",
        });
      }

      questionnaire.forEach((question) => {
        const answer_filtered = questionnaire_answers
          .toJSON()
          .filter((item) => item.id_name === question.name);

        // define <empty> when no answer for this question
        var answer = "--KOSONG--";
        if (answer_filtered.length > 0) {
          answer = answer_filtered[0].answer;

          if (answer.charAt(0) === "[") {
            answer = JSON.parse(answer);
          }
        }

        data.push({
          name: question.name,
          label: question.label,
          answer: answer,
        });
      });

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Kuisioner Partisipan berhasil dimuat!",
        data: data,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: "Gagal memuat Kuisioner Partisipan karena kesalahan server",
      });
    }
  }

  async index({ params, request, response }) {
    const { activity_id } = params;
    const data = request.all();
    data.activity_id = activity_id;
    const registrationStatus = await ActivityRegistration.registrationStatus();

    const rules = {
      activity_id: "required|number",
      status: [rule("in", registrationStatus)],
      role_id: "number",
      university_id: "number",
      page: "number",
      perPage: "number",
    };

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response.status(400).json({
        status: "FAILED",
        message: validation.messages(),
      });
    }

    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

    if (!activity) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data aktivitas yang ditemukan",
      });
    }

    const whereClause = {};
    whereClause.activity_id = activity_id;

    if (data.status) {
      whereClause.status = data.status;
    }

    if (data.role_id) {
      whereClause["members.role_id"] = data.role_id;
    }

    if (data.university_id) {
      whereClause["members.university_id"] = data.university_id;
    }

    const page = data.page ? data.page : 1;
    const perPage = data.perPage ? data.perPage : 10;

    try {
      const activity_registrations = await ActivityRegistration.getParticipants(
        whereClause,
        page,
        perPage
      );

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Partisipan berhasil dimuat!",
        data: activity_registrations,
      });
    } catch (error) {
      return response.status(400).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async show_statistics({ params, response }) {
    const { activity_id } = params;
    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

    if (!activity) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data aktivitas yang ditemukan",
      });
    }

    try {
      const data = {};
      const registrationStatus =
        await ActivityRegistration.registrationStatus();

      const activity_registrations = await ActivityRegistration.query()
        .where({ activity_id: activity_id })
        .with("member")
        .fetch();

      data.total_participants = activity_registrations.toJSON().length;
      data.total_males = activity_registrations
        .toJSON()
        .filter((participant) => participant.member.gender === "M").length;
      data.total_females = activity_registrations
        .toJSON()
        .filter((participant) => participant.member.gender === "F").length;

      registrationStatus.forEach((status) => {
        const data_temp = activity_registrations
          .toJSON()
          .filter((participant) => {
            return participant.status === status;
          });

        data[status] = data_temp.length;
      });

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data Statistik Partisipan berhasil dimuat!",
        data: data,
      });
    } catch (error) {
      return response.status(400).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  async export({ params, response }) {
    const { activity_id } = params;
    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

    if (!activity) {
      return response.status(400).json({
        status: "FAILED",
        message: "Tidak ada data aktivitas yang ditemukan",
      });
    }

    const activity_registrations = await ActivityRegistration.query()
      .where({ activity_id: activity_id })
      .with("member")
      .with("member.member_role")
      .with("member.university")
      .with("member.province")
      .with("member.regency")
      .with("member.district")
      .with("member.village")
      .fetch();

    if (!activity_registrations) {
      return response.status(400).json({
        status: "FAILED",
        message: "Belum terdapat member yang mendaftar pada aktivitas ini",
      });
    }

    const registrationIds = this.getActivityRegistrationsIds(
      await activity_registrations.toJSON()
    );

    const questionnaire_answers = await SaveQuestionnaire.query()
      .whereIn("id_registration", registrationIds)
      .fetch();

    const answers_data = this.buildQuestionnaireAnswerData(
      await questionnaire_answers.toJSON()
    );

    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");
      const font = { name: "Times New Roman", size: 12 };

      worksheet.columns = [
        { header: "No", key: "no", width: 5, style: { font: font } },
        { header: "Name", key: "name", width: 40, style: { font: font } },
        { header: "Gender", key: "gender", width: 7, style: { font: font } },
        { header: "Email", key: "email", width: 30, style: { font: font } },
        { header: "Phone", key: "phone", width: 20, style: { font: font } },
        { header: "Line ID", key: "line_id", width: 15, style: { font: font } },
        {
          header: "Province",
          key: "province",
          width: 25,
          style: { font: font },
        },
        { header: "Regency", key: "regency", width: 40, style: { font: font } },
        {
          header: "District",
          key: "district",
          width: 40,
          style: { font: font },
        },
        { header: "Village", key: "village", width: 40, style: { font: font } },
        {
          header: "Date of birthday",
          key: "date_of_birthday",
          width: 20,
          style: { font: font },
        },
        {
          header: "City of birth",
          key: "city_of_birth",
          width: 35,
          style: { font: font },
        },
        {
          header: "From addres",
          key: "from_address",
          width: 150,
          style: { font: font },
        },
        {
          header: "Current address",
          key: "current_address",
          width: 150,
          style: { font: font },
        },
        {
          header: "University",
          key: "university",
          width: 50,
          style: { font: font },
        },
        { header: "Faculty", key: "faculty", width: 70, style: { font: font } },
        { header: "Major", key: "major", width: 40, style: { font: font } },
        {
          header: "Intake Year",
          key: "intake_year",
          width: 13,
          style: { font: font },
        },
        { header: "Role", key: "role", width: 15, style: { font: font } },
        { header: "SSC", key: "ssc", width: 11, style: { font: font } },
        { header: "LMD", key: "lmd", width: 11, style: { font: font } },
        { header: "Komprof", key: "komprof", width: 11, style: { font: font } },
      ];

      const form_data = JSON.parse((await activity.toJSON()).form_data);

      form_data.forEach((form) => {
        worksheet.columns = [
          ...worksheet.columns,
          {
            header: form.label,
            key: form.name,
            width: 20,
            style: { font: font },
          },
        ];
      });

      let no = 1;
      let row = await activity_registrations.toJSON().map((item) => {
        var propertiesNull = { name: " " };
        if (item.member.university_id === null) {
          item.member.university = propertiesNull;
        }
        if (item.member.province_id === null) {
          item.member.province = propertiesNull;
        }
        if (item.member.regency_id === null) {
          item.member.regency = propertiesNull;
        }
        if (item.member.district_id === null) {
          item.member.district = propertiesNull;
        }
        if (item.member.village_id === null) {
          item.member.village = propertiesNull;
        }

        let row_data = {
          no: no++,
          name: item.member.name,
          gender: item.member.gender,
          email: item.member.email,
          phone: item.member.phone,
          line_id: item.member.line_id,
          province: item.member.province.name,
          regency: item.member.regency.name,
          district: item.member.district.name,
          village: item.member.village.name,
          date_of_birthday: item.member.date_of_birthday,
          city_of_birth: item.member.city_of_birth,
          from_address: item.member.from_address,
          current_address: item.member.current_address,
          university: item.member.university.name,
          faculty: item.member.faculty,
          major: item.member.major,
          intake_year: item.member.intake_year,
          role: item.member.member_role?.name,
          ssc: item.member.ssc,
          lmd: item.member.lmd,
          komprof: item.member.komprof,
        };
        form_data.forEach((form) => {
          row_data[form.name] = this.getRegistrantFormDataValue(
            item.id,
            form.name,
            answers_data
          );
        });
        worksheet.addRow(row_data);
      });

      const formatted = Date.now();
      // Catatan
      // sekarang file akan dimasukkan ke buffer terlebih dahulu
      // Solusi ini cukup untuk jumlah pendaftar kecil
      // untuk jumlah besar baiknya tidak ke buffer, diarahkan langsung ke output stream
      // (misal file di publik)

      row = await Promise.all(row);
      const buffer = await workbook.xlsx.writeBuffer();

      return response
        .status(200)
        .safeHeader("Content-type", "application/vnd-ms-excel")
        .safeHeader(
          "Content-Disposition",
          `attachment; filename=${sanitizor.slug(activity.name)}.xls`
        )
        .send(buffer);
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        status: "FAILED",
        message: error,
      });
    }
  }

  getActivityRegistrationsIds(activityRegistrations) {
    const ids = activityRegistrations.map(
      (activityRegistration) => activityRegistration.id
    );
    return ids;
  }

  buildQuestionnaireAnswerData(questionnaire_answers) {
    const data = {};
    questionnaire_answers.forEach((answer) => {
      const registration_id = answer.id_registration;
      const form_name = answer.id_name;
      const answer_value = answer.answer;

      if (data[registration_id] == null) {
        data[registration_id] = {};
      }

      data[registration_id][form_name] = answer_value;
    });

    return data;
  }

  getRegistrantFormDataValue(registration_id, form_name, data) {
    if (data[registration_id] == null) {
      return null;
    }
    return data[registration_id][form_name];
  }
}

module.exports = ActivityParticipanController;
