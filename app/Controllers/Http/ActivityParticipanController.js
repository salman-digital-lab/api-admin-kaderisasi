'use strict'

const { validate, rule, sanitizor } = use("Validator");
const ActivityRegistration = use("App/Models/ActivityRegistration");
const Activity = use("App/Models/Activity");
const SaveQuestionnaire = use('App/Models/SaveQuestionnaire');
const Excel = require('exceljs')

class ActivityParticipanController {

    async show_questionnaire({ params, response }) {

        const { member_id, activity_id } = params;

        const rules = {
            member_id: 'required|number',
            activity_id: 'required|number'
        }

        const validation = await validate({
            member_id: member_id,
            activity_id: activity_id
        }, rules);

        if (validation.fails()) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: validation.messages()
                });
        }

        const activity_registration = await ActivityRegistration.findBy({
            'member_id': member_id,
            'activity_id': activity_id
        });

        if (!activity_registration) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data yang ditemukan"
                });
        }

        try {

            const activity = await Activity.findBy({ id: activity_registration.activity_id, is_deleted: 0 });
            if (!activity) {
                return response
                    .status(400)
                    .json({
                        status: "FAILED",
                        message: "Tidak ada data aktivitas yang ditemukan"
                    });
            }

            const questionnaire = JSON.parse(activity.toJSON().form_data);
            if (!questionnaire) {
                return response
                    .status(400)
                    .json({
                        status: "FAILED",
                        message: "Aktivitas ini tidak memiliki kuisioner"
                    });
            }

            const data = [];
            const questionnaire_answers = await SaveQuestionnaire.query()
                .where('id_registration', activity_registration.id)
                .fetch()

            if (questionnaire_answers.rows.length < 1) {
                return response
                    .status(400)
                    .json({
                        status: "FAILED",
                        message: "Tidak ada data yang ditemukan"
                    });
            }

            questionnaire.forEach(question => {

                const answer_filtered = questionnaire_answers.toJSON().filter((item) => item.id_name === question.name)
                let answer = answer_filtered[0].answer;

                if (answer.charAt(0) === '[') {
                    answer = JSON.parse(answer)
                }

                data.push({
                    "name": question.name,
                    "label": question.label,
                    "answer": answer
                })
            });

            return response
                .status(200)
                .json({
                    status: "SUCCESS",
                    message: "Data Kuisioner Partisipan berhasil dimuat!",
                    data: data
                });
        } catch (error) {
            return response
                .status(500)
                .json({
                    status: "FAILED",
                    message: "Gagal memuat Kuisioner Partisipan karena kesalahan server"
                });
        }
    }

    async show_participants({ params, request, response }) {

        const { activity_id } = params;
        const data = request.all();
        data.activity_id = activity_id;
        const registrationStatus = await ActivityRegistration.registrationStatus();

        const rules = {
            activity_id: 'required|number',
            status: [rule('in', registrationStatus)],
            role_id: 'number',
            university_id: 'number',
            page: 'number',
            perPage: 'number',
        }

        const validation = await validate(data, rules);

        if (validation.fails()) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: validation.messages()
                });
        }

        const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

        if (!activity) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data aktivitas yang ditemukan"
                });
        }

        const whereClause = {}
        whereClause.activity_id = activity_id

        if (data.status) {
            whereClause.status = data.status
        }

        if (data.role_id) {
            whereClause["members.role_id"] = data.role_id
        }

        if (data.university_id) {
            whereClause["members.university_id"] = data.university_id
        }

        const page = (data.page) ? data.page : 1
        const perPage = (data.perPage) ? data.perPage : 10

        try {

            const activity_registrations = await ActivityRegistration.getParticipants(whereClause, page, perPage);

            return response
                .status(200)
                .json({
                    status: "SUCCESS",
                    message: "Data Partisipan berhasil dimuat!",
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

    async show_statistics({ params, response }) {

        const { activity_id } = params;
        const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

        if (!activity) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data aktivitas yang ditemukan"
                });
        }

        try {

            let data = {}
            const registrationStatus = await ActivityRegistration.registrationStatus();

            const activity_registrations = await ActivityRegistration.query()
                .where({ activity_id: activity_id })
                .with("member")
                .fetch()

            data.total_participants = activity_registrations.toJSON().length
            data.total_males = activity_registrations.toJSON().filter((participant) => participant.member.gender === 'M').length
            data.total_females = activity_registrations.toJSON().filter((participant) => participant.member.gender === 'F').length

            registrationStatus.forEach(status => {

                const data_temp = activity_registrations.toJSON().filter((participant) => {
                    return participant.status === status
                });

                data[status] = data_temp.length
            });

            return response
                .status(200)
                .json({
                    status: "SUCCESS",
                    message: "Data Statistik Partisipan berhasil dimuat!",
                    data: data,
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

    async update_registration_status({ params, response }) {

        const data = params;
        const registrationStatus = await ActivityRegistration.registrationStatus();

        const rules = {
            member_id: 'required|number',
            activity_id: 'required|number',
            status: [rule('in', registrationStatus)]
        }

        const validation = await validate(data, rules);

        if (validation.fails()) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: validation.messages()
                });
        }

        const activity_registration = await ActivityRegistration.findBy({
            'member_id': data.member_id,
            'activity_id': data.activity_id
        });

        if (!activity_registration) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data yang ditemukan"
                });
        }

        try {

            await ActivityRegistration
                .query()
                .where('member_id', data.member_id)
                .where('activity_id', data.activity_id)
                .update({ status: data.status })

            const activity_registrations = await ActivityRegistration.findBy({
                'member_id': data.member_id,
                'activity_id': data.activity_id
            });

            return response
                .status(200)
                .json({
                    status: "SUCCESS",
                    message: "Status Partisipan berhasil diperbarui!",
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

    async export({ params, response }) {

        const { activity_id } = params
        const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

        if (!activity) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data aktivitas yang ditemukan"
                });
        }

        const activity_registrations = await ActivityRegistration.query()
            .where({ activity_id: activity_id })
            .with("member")
            .with('member.member_role')
            .fetch()

        if (!activity_registrations.toJSON()) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Belum terdapat member yang mendaftar pada aktivitas ini"
                });
        }

        try {

            let workbook = new Excel.Workbook();
            let worksheet = workbook.addWorksheet("Sheet 1");
            let font = { name: 'Times New Roman', size: 12 };

            worksheet.columns = [
                { header: "No", key: "no", width: 5, style: { font: font } },
                { header: "Name", key: "name", width: 40, style: { font: font } },
                { header: "Gender", key: "gender", width: 7, style: { font: font } },
                { header: "Email", key: "email", width: 30, style: { font: font } },
                { header: "Phone", key: "phone", width: 20, style: { font: font } },
                { header: "Line ID", key: "line_id", width: 15, style: { font: font } },
                { header: "Role", key: "role", width: 15, style: { font: font } },
                { header: "Created At", key: "created_at", width: 15, style: { font: font } },
                { header: "Status", key: "status", width: 20, style: { font: font } },
                { header: "Questionnaire", key: "questionnaire", width: 50, style: { font: font } },
            ];

            let no = 1
            let row = await activity_registrations.toJSON().map(item => {
                worksheet.addRow({
                    no: no++,
                    name: item.member.name,
                    gender: item.member.gender,
                    email: item.member.email,
                    phone: item.member.phone,
                    line_id: item.member.line_id,
                    role: item.member.member_role.name,
                    created_at: item.created_at,
                    status: item.status,
                    questionnaire: item.questionnaire
                })
            })

            const formatted = Date.now()

            // Catatan
            // File Export akan menumpuk di folder tmp/uploads/exports
            // Karena tidak dihapus
            // Mohon saran untuk solusi alternatifnya

            row = await Promise.all(row)
            await workbook.xlsx.writeFile(`./tmp/uploads/exports/export-participants-${sanitizor.slug(activity.name)}-${formatted}.xlsx`)

            return response
                .status(200)
                .json({
                    status: "SUCCESS",
                    message: "Data Partisipan berhasil diexport!",
                    data: {
                        'file_location': 'tmp/uploads/exports/',
                        'file_name': `export-participants-${activity_id}-${formatted}.xlsx`
                    },
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

module.exports = ActivityParticipanController
