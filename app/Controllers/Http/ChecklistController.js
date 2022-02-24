'use strict'

const Checklist = use('App/Models/Checklist')
const MemberChecklist = use('App/Models/MemberChecklist')
const { validateAll, sanitizor } = use('Validator')
const Member = use('App/Models/Member')

/**
 * Resourceful controller for interacting with checklists
 */
class ChecklistController {
  /**
   * Show a list of all checklists.
   * GET checklists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, request }) {

    const data = request.all()
    const rules = {
      search: 'string',
      page: 'number',
      perPage: 'number'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()[0]
        })
    }

    const search = data.search ? sanitizor.escape(data.search) : ''
    const page = data.page ? data.page : 1
    const perPage = data.perPage ? data.perPage : 10
    const checklists = await Checklist
      .query()
      .where('checklist_name', 'LIKE', `%${search}%`)
      .paginate(page, perPage)

    return response.json({ status: 'SUCCESS', message: 'success get checklists', data: checklists })
  }

  /**
   * Create/save a new checklist.
   * POST checklists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const rules = {
      checklist_name: 'required|unique:checklists,checklist_name'
    }

    const data = request.all()
    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response.json({
        status: 'FAILED',
        message: validation.messages()
      })
    }

    try {
      const checklist = await Checklist.create({
        checklist_name: data.checklist_name,
        admin_id: auth.user.id
      })

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil menambahkan checklist baru',
        checklist
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Display a single checklist.
   * GET checklists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const id = params.id
      const checklist = await Checklist
        .query()
        .where('id', id)
        .withCount('members')
        .fetch()

      if (checklist.toJSON().length > 0) {
        return response.json({
          status: 'SUCCESS',
          message: 'Berhasil memperoleh checklist',
          checklist
        })
      }

      return response.json({
        status: 'SUCCESS',
        message: 'checklist tidak ditemukan'
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Update checklist details.
   * PUT or PATCH checklists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ auth, params, request, response }) {
    const id = params.id
    const data = request.all()

    const checklist = await Checklist.find(id)
    if (!checklist) {
      return response.json({
        status: 'FAILED',
        message: 'Checklist tidak ditemukan'
      })
    }

    const rules = {
      checklist_name: `required|unique:checklists,checklist_name,id,${id}`
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response.json({ status: 'FAILED', messages: validation.messages() })
    }

    try {
      checklist.checklist_name = data.checklist_name
      checklist.admin_id = auth.user.id
      checklist.updated_at = Date.now()
      await checklist.save()

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil update data checklist',
        checklist
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Delete a checklist with id.
   * DELETE checklists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const id = params.id
    const checklist = await Checklist.find(id)
    if (!checklist) {
      return response.json({
        status: 'FAILED',
        message: 'Checklist tidak ditemukan'
      })
    }

    try {
      await checklist.delete()

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil menghapus checklist'
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  async tick({ request, response, params }) {
    const data = params
    const rules = {
      member_id: 'required|number',
      checklist_id: 'required|number'
    }
    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response.json({ status: 'FAILED', messages: validation.messages() })
    }

    const check = await MemberChecklist
      .query().where('member_id', data.member_id)
      .where('checklist_id', data.checklist_id)
      .first()
    if (check) {
      return response.json({
        status: 'FAILED',
        message: 'Checklist ini sudah di centang'
      })
    }

    try {
      await MemberChecklist.create({
        member_id: data.member_id,
        checklist_id: data.checklist_id
      })

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil mencentang checklist'
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  async untick({ params, response }) {
    const data = params

    const untick = await MemberChecklist
      .query().where('member_id', data.member_id)
      .where('checklist_id', data.checklist_id)
      .first()
    if (!untick) {
      return response.json({
        status: 'FAILED',
        message: 'Data tidak ditemukan'
      })
    }

    try {
      untick.delete()
      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil Un-Centang checklist'
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  async member({ params, response }) {
    const id = params.member_id
    try {
      const member = await Member
        .query()
        .where('id', id)
        .select('id', 'name', 'email')
        .with('checklists')
        .fetch()

      if (member.toJSON().length > 0) {
        return response.json({
          status: 'SUCCESS',
          message: 'Berhasil memperoleh checklist member',
          member: member
        })
      }

      return response.status(404).json({
        status: 'Failed',
        message: 'member tidak ditemukan'
      })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }
}

module.exports = ChecklistController
