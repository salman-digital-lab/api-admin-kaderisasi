'use strict'
const Database = use('Database')
const d = Date(Date.now())
const date = d.toString()
const Excel = require('exceljs')

const { validate, sanitizor } = use('Validator')

const StudentCare = use('App/Models/StudentCare')
const User = use('App/Models/User')

class StudentCareController {
  async delete ({ params, response }) {
    const data = params.id
    const hapusData = await Database
      .table('student_care')
      .where('id', data)
      .delete()

    if (hapusData) {
      return response.status(200).json({
        status: 'SUCCESS',
        message: `Data dengan id ${data} BERHASIL dihapus`
      })
    } else {
      return response.status(404).json({
        status: 'FAILED',
        message: `Data dengan id ${data} GAGAL dihapus`
      })
    }
  }

  async get ({ request, response }) {
    const params = request.get()

    const rules = {
      page: 'number',
      perPage: 'number',
      name: 'string'
    }

    const validation = await validate(params, rules)

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()[0].message
        })
    }

    const page = params.page || 1
    const perPage = params.perPage || 20
    const sortField = params.sortField || 'created_at'
    const name = sanitizor.escape(params.name) || ""

    try {
      const data = await StudentCare
        .query()
        .innerJoin('members', 'student_care.member_id', 'members.id')
        .where('members.name', 'like', `%${name}%`)
        .with('member')
        .with('counselor')
        .orderBy(sortField, 'desc')
        .select("student_care.*")
        .paginate(page, perPage)

      return response.status(200).json({
        status: 'SUCCESS',
        message: 'Data student care BERHASIL diperoleh',
        data: data
      })
    } catch (err) {
      return response.status(500).json({
        status: 'FAILED',
        message: err.message
      })
    }
  }

  async getById ({ params, response }) {
    const data = await StudentCare
      .query()
      .with('member')
      .with('counselor')
      .where('id', params.id)
      .first()

    if (data) {
      return response.status(200).json({
        status: 'SUCCESS',
        message: 'Data student care berhasil diperoleh',
        data: data
      })
    }

    return response.status(404).json({
      status: 'FAILED',
      message: 'Data student care tidak ditemukan'
    })
  }

  async update ({ request, response, params }) {
    const data = params.id

    const updateData = await Database
      .table('student_care')
      .where('id', data)
      .update({
        problem_owner: request.input('problem_owner'),
        problem_owner_name: request.input('problem_owner_name'),
        problem_category: request.input('problem_category'),
        problem_category_desk: request.input('problem_category_desk'),
        technical_handling: request.input('technical_handling'),
        counselor_gender: request.input('counselor_gender'),
        id_counselor: request.input('id_counselor'),
        status_handling: request.input('status_handling'),
        desk_handling: request.input('desk_handling'),
        updated_at: new Date()
      })

    if (updateData) {
      return response.status(200).json({
        status: 'SUCCESS',
        message: 'Data BERHASIL diperbarui'
      })
    } else {
      return response.status(404).json({
        status: 'FAILED',
        message: 'Maaf data GAGAL diperbarui'
      })
    }
  }

  async getCounselors ({ response }) {
    const data = await User
      .query()
      .innerJoin('users_groups', 'users.id', 'users_groups.user_id')
      .innerJoin('groups', 'users_groups.group_id', 'groups.id')
      .where('groups.shortname', 'KCR')
      .fetch()

    return response.status(200).json({
      status: 'SUCCESS',
      message: 'Data para konselor berhasil diambil',
      data: data
    })
  }

async export ({ request, response }) {
  const timeNow = new Date()
  let {time_start, time_end} = request.all()
  if(!time_end) time_end = `${timeNow.getFullYear()}-${(timeNow.getMonth()+1)}-${timeNow.getDate()}`
  if(!time_start) time_start = timeNow.getFullYear() + "-" + (timeNow.getMonth()+1) + "-01"
    const student_cares = await StudentCare.query()
    .whereBetween('created_at', [time_start, time_end])
    .with('member')
    .with('counselor')
    .fetch()
    try {
      const workbook = new Excel.Workbook()
      const worksheet = workbook.addWorksheet('Sheet 1')
      const font = { name: 'Times New Roman', size: 12 }

      worksheet.columns = [
        { header: 'No', key: 'no', width: 5, style: { font: font } },
        { header: 'Name Member', key: 'name', width: 30, style: { font: font } },
        { header: 'Problem Owner', key: 'problem_owner', width: 15, style: { font: font } },
        { header: 'Problem Owner Name', key: 'problem_owner_name', width: 23, style: { font: font } },
        { header: 'Problem Category', key: 'problem_category', width: 30, style: { font: font } },
        { header: 'Problem Category Desk', key: 'problem_category_desk', width: 70, style: { font: font } },
        { header: 'Technical Handling', key: 'technical_handling', width: 20, style: { font: font } },
        { header: 'Counselor Gender', key: 'counselor_gender', width: 20, style: { font: font } },
        { header: 'Counselor Name', key: 'counselor_name', width: 20, style: { font: font } },
        { header: 'Status Handling', key: 'status_handling', width: 20, style: { font: font } },
        { header: 'Desk Handling', key: 'desk_handling', width: 100, style: { font: font } },
        { header: 'Created At', key: 'created_at', width: 20, style: { font: font } },
      ]
      let no = 1
      let row = await student_cares.toJSON().map(item => {
        var propertiesNull = {display_name: "-"};
        if(item.id_counselor === null) item.counselor = propertiesNull
        let row_data = {
          no: no++,
          name: item.member.name,
          problem_owner: item.problem_owner,
          problem_owner_name: item.problem_owner_name,
          problem_category: item.problem_category,
          problem_category_desk: item.problem_category_desk,
          technical_handling: item.technical_handling,
          counselor_gender: item.counselor_gender,
          counselor_name: item.counselor.display_name,
          status_handling: item.status_handling,
          desk_handling: item.desk_handling,
          created_at: item.created_at,
        }
        worksheet.addRow(row_data);
      })
      const formatted = Date.now()
      row = await Promise.all(row)
      const buffer = await workbook.xlsx.writeBuffer()
      const exportName =`Data-Student-Care-${time_start}-${time_end}`

      return response
        .status(200)
        .safeHeader('Content-type', 'application/vnd-ms-excel')
        .safeHeader('Content-Disposition', `attachment; filename=${exportName}.xls`)
        .send(buffer)
    } catch (error) {
      console.log(error);
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: error
        })
    }
  }
    
  }

module.exports = StudentCareController
