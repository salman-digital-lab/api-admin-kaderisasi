'use strict'

const { validate, rule, sanitizor } = use('Validator')
const ActivityRegistration = use('App/Models/ActivityRegistration')
const Activity = use('App/Models/Activity')
const SaveQuestionnaire = use('App/Models/SaveQuestionnaire')
const Excel = require('exceljs')

class ActivityParticipanController {
  async show ({ params, response }) {
    const { registration_id } = params

    const rules = {
      registration_id: 'number'
    }

    const validation = await validate({ registration_id: registration_id }, rules)

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()
        })
    }

    const activity_registration = await ActivityRegistration.find(registration_id)

    if (!activity_registration) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Tidak ada data yang ditemukan'
        })
    }

    try {
      const activity_registrations = await ActivityRegistration.query()
        .where({ id: registration_id })
        .with('member')
        .with('member.member_role')
        .fetch()

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Data Registrasi Aktivitas berhasil dimuat!',
          data: activity_registrations
        })
    } catch (error) {
      return response
        .status(500)
        .json({
          status: 'FAILED',
          message: error
        })
    }
  }

  async update_status ({ params, response }) {
    const data = params
    const registrationStatus = await ActivityRegistration.registrationStatus()

    const rules = {
      registration_id: 'required|number',
      status: [rule('in', registrationStatus)]
    }

    const validation = await validate(data, rules)

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()
        })
    }

    const activity_registration = await ActivityRegistration.find(data.registration_id)

    if (!activity_registration) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Tidak ada data yang ditemukan'
        })
    }

    try {
      await ActivityRegistration
        .query()
        .where('id', data.registration_id)
        .update({ status: data.status })

      const activity_registrations = await ActivityRegistration.find(data.registration_id)

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Status Partisipan berhasil diperbarui!',
          data: [activity_registrations]
        })
    } catch (error) {
      return response
        .status(500)
        .json({
          status: 'FAILED',
          message: error
        })
    }
  }

  async show_questionnaire ({ params, response }) {
    const { registration_id } = params

    const rules = {
      registration_id: 'required|number'
    }

    const validation = await validate({
      registration_id: registration_id
    }, rules)

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()
        })
    }

    const activity_registration = await ActivityRegistration.find(registration_id)

    if (!activity_registration) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Tidak ada data yang ditemukan'
        })
    }

    try {
      const activity = await Activity.findBy({ id: activity_registration.activity_id, is_deleted: 0 })
      if (!activity) {
        return response
          .status(400)
          .json({
            status: 'FAILED',
            message: 'Tidak ada data aktivitas yang ditemukan'
          })
      }

      const questionnaire = JSON.parse(activity.toJSON().form_data)
      if (!questionnaire) {
        return response
          .status(400)
          .json({
            status: 'FAILED',
            message: 'Aktivitas ini tidak memiliki kuisioner'
          })
      }

      const data = []
      const questionnaire_answers = await SaveQuestionnaire.query()
        .where('id_registration', activity_registration.id)
        .fetch()

      if (questionnaire_answers.rows.length < 1) {
        return response
          .status(400)
          .json({
            status: 'FAILED',
            message: 'Tidak ada data yang ditemukan'
          })
      }

      questionnaire.forEach(question => {
        const answer_filtered = questionnaire_answers.toJSON().filter((item) => item.id_name === question.name)
        
        // define <empty> when no answer for this question
        var answer = "--KOSONG--"
        if(answer_filtered.length > 0)
        {
          answer = answer_filtered[0].answer

          if (answer.charAt(0) === '[') {
            answer = JSON.parse(answer)
          }   
        }

        data.push({
          name: question.name,
          label: question.label,
          answer: answer
        })
      })

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Data Kuisioner Partisipan berhasil dimuat!',
          data: data
        })
    } catch (error) {
      return response
        .status(500)
        .json({
          status: 'FAILED',
          message: 'Gagal memuat Kuisioner Partisipan karena kesalahan server'
        })
    }
  }

  async index ({ params, request, response }) {
    const { activity_id } = params
    const data = request.all()
    data.activity_id = activity_id
    const registrationStatus = await ActivityRegistration.registrationStatus()

    const rules = {
      activity_id: 'required|number',
      status: [rule('in', registrationStatus)],
      role_id: 'number',
      university_id: 'number',
      page: 'number',
      perPage: 'number'
    }

    const validation = await validate(data, rules)

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()
        })
    }

    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 })

    if (!activity) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Tidak ada data aktivitas yang ditemukan'
        })
    }

    const whereClause = {}
    whereClause.activity_id = activity_id

    if (data.status) {
      whereClause.status = data.status
    }

    if (data.role_id) {
      whereClause['members.role_id'] = data.role_id
    }

    if (data.university_id) {
      whereClause['members.university_id'] = data.university_id
    }

    const page = (data.page) ? data.page : 1
    const perPage = (data.perPage) ? data.perPage : 10

    try {
      const activity_registrations = await ActivityRegistration.getParticipants(whereClause, page, perPage)

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Data Partisipan berhasil dimuat!',
          data: activity_registrations
        })
    } catch (error) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: error
        })
    }
  }

  async show_statistics ({ params, response }) {
    const { activity_id } = params
    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 })

    if (!activity) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Tidak ada data aktivitas yang ditemukan'
        })
    }

    try {
      const data = {}
      const registrationStatus = await ActivityRegistration.registrationStatus()

      const activity_registrations = await ActivityRegistration.query()
        .where({ activity_id: activity_id })
        .with('member')
        .fetch()

      data.total_participants = activity_registrations.toJSON().length
      data.total_males = activity_registrations.toJSON().filter((participant) => participant.member.gender === 'M').length
      data.total_females = activity_registrations.toJSON().filter((participant) => participant.member.gender === 'F').length

      registrationStatus.forEach(status => {
        const data_temp = activity_registrations.toJSON().filter((participant) => {
          return participant.status === status
        })

        data[status] = data_temp.length
      })

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Data Statistik Partisipan berhasil dimuat!',
          data: data
        })
    } catch (error) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: error
        })
    }
  }

  async export ({ params, response }) {
    const { activity_id } = params
    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 })

    if (!activity) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Tidak ada data aktivitas yang ditemukan'
        })
    }

    const activity_registrations = await ActivityRegistration.query()
      .where({ activity_id: activity_id })
      .with('member')
      .with('member.member_role')
      .fetch()

    if (!activity_registrations.toJSON()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: 'Belum terdapat member yang mendaftar pada aktivitas ini'
        })
    }

    try {
      const workbook = new Excel.Workbook()
      const worksheet = workbook.addWorksheet('Sheet 1')
      const font = { name: 'Times New Roman', size: 12 }

      worksheet.columns = [
        { header: 'No', key: 'no', width: 5, style: { font: font } },
        { header: 'Name', key: 'name', width: 40, style: { font: font } },
        { header: 'Gender', key: 'gender', width: 7, style: { font: font } },
        { header: 'Email', key: 'email', width: 30, style: { font: font } },
        { header: 'Phone', key: 'phone', width: 20, style: { font: font } },
        { header: 'Line ID', key: 'line_id', width: 15, style: { font: font } },
        { header: 'Role', key: 'role', width: 15, style: { font: font } },
        { header: 'Created At', key: 'created_at', width: 15, style: { font: font } },
        { header: 'Status', key: 'status', width: 20, style: { font: font } },
      ]

      const form_data = JSON.parse((await activity.toJSON()).form_data);

      form_data.forEach((form) => {
        worksheet.columns = [...worksheet.columns, {
          header: form.label, 
          key: form.name, 
          width: 20, 
          style: { font: font }
        }]
      })

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
      // sekarang file akan dimasukkan ke buffer terlebih dahulu
      // Solusi ini cukup untuk jumlah pendaftar kecil
      // untuk jumlah besar baiknya tidak ke buffer, diarahkan langsung ke output stream
      // (misal file di publik)

      row = await Promise.all(row)
      const buffer = await workbook.xlsx.writeBuffer()

      return response
        .status(200)
        .safeHeader('Content-type', 'application/vnd-ms-excel')
        .safeHeader('Content-Disposition', `attachment; filename=${sanitizor.slug(activity.name)}.xls`)
        .send(buffer)
    } catch (error) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: error
        })
    }
  }
}

module.exports = ActivityParticipanController
