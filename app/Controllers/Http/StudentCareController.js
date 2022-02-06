'use strict'
const Database = use('Database')
const d = Date(Date.now())
const date = d.toString()

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
}

module.exports = StudentCareController
