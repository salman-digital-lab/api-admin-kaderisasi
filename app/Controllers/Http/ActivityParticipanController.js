'use strict'

const { validate, rule } = use("Validator");
const ActivityRegistration = use("App/Models/ActivityRegistration");

class ActivityParticipanController {

    async show_questionnaire({ params, response }) {

        const { member_id, activity_id } = params;
        const activity_registrations = await ActivityRegistration.findBy({
            'member_id': member_id,
            'activity_id': activity_id
        });

        if (activity_registrations) {

            try {
                return response
                    .status(200)
                    .json({
                        status: "SUCCESS",
                        message: "Data Kuisioner Partisipan berhasil dimuat!",
                        data: {
                            questionnaire: activity_registrations.questionnaire
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
        } else {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data yang ditemukan"
                });
        }
    }

    async show_participants({ params, response }) {

        const { activity_id, status } = params;
        const regexStatus = await ActivityRegistration.regexStatus();

        const rules = {
            activity_id: 'number',
            status: [rule('in', regexStatus)]
        }

        const validation = await validate({
            'status': status,
            'activity_id': activity_id
        }, rules);

        if (validation.fails()) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: validation.messages()
                });
        } else {

            const activity_registrations = await ActivityRegistration.query()
                .where('activity_id', activity_id)
                .where('status', status)
                .fetch()

            if (activity_registrations.rows.length > 0) {
                try {
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

    async show_statistics({ params, response }) {

        const { activity_id } = params;
        const activity_registrations = await ActivityRegistration.query()
            .where('activity_id', activity_id)
            .fetch()

        if (activity_registrations.rows.length > 0) {

            let data = {}
            const regexStatus = await ActivityRegistration.regexStatus();

            data.total_participants = activity_registrations.rows.length

            // Untuk Total Males dan Total females
            // Hard Code karena harus mengambil dan difilter dari services member (field gender)

            data.total_males = Math.floor(activity_registrations.rows.length / 2)
            data.total_females = Math.round(activity_registrations.rows.length / 2)

            regexStatus.forEach(status => {

                const data_temp = activity_registrations.rows.filter((participant) => {
                    return participant.status === status
                });

                data[status] = data_temp.length
            });

            try {
                return response
                    .status(200)
                    .json({
                        status: "SUCCESS",
                        message: "Data Partisipan berhasil dimuat!",
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
        } else {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: "Tidak ada data yang ditemukan"
                });
        }
    }

    async update_registration_status({ params, request, response }) {

        const data = params;
        const regexStatus = await ActivityRegistration.regexStatus();

        const rules = {
            member_id: 'required|number',
            activity_id: 'required|number',
            status: [rule('in', regexStatus)]
        }

        const validation = await validate(data, rules);

        if (validation.fails()) {
            return response
                .status(400)
                .json({
                    status: "FAILED",
                    message: validation.messages()
                });
        } else {

            const activity_registration = await ActivityRegistration.findBy({
                'member_id': data.member_id,
                'activity_id': data.activity_id
            });

            if (activity_registration) {

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
            } else {
                return response
                    .status(400)
                    .json({
                        status: "FAILED",
                        message: "Tidak ada data yang ditemukan"
                    });
            }
        }


        if (category) {

            const rules = {
                name: "required",
            };

            const data = request.all();
            const validation = await validate(data, rules);

            if (validation.fails()) {
                return response
                    .status(400)
                    .json({
                        status: "FAILED",
                        message: validation.messages()
                    });
            } else {

                try {

                    category.name = data.name;
                    await category.save();

                    const categories = await Category.find(category.id);

                    return response
                        .status(200)
                        .json({
                            status: "SUCCESS",
                            message: "Data Kategori Aktivitas berhasil diperbarui!",
                            data: categories,
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
}

module.exports = ActivityParticipanController
