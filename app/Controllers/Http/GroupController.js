'use strict'

const User = use('App/Models/User')
const UsersGroup = use('App/Models/UsersGroup')
const Group = use('App/Models/Group')
const Privilege = use('App/Models/Privilege')
const { validate, validateAll, sanitizor } = use('Validator')

class GroupController {
  async index ({ response, request }) {

    const data = request.all()

    const rules = {
      search: 'string',
      page: 'number',
      perPage: 'number'
    }

    const validation = await validate(data, rules)

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

    const groups = await Group
      .query()
      .where('shortname', 'LIKE', `%${search}%`)
      .orWhere('description', 'LIKE', `%${search}%`)
      .paginate(page, perPage)

    return response
      .status(200)
      .json({ status: 'SUCCESS', message: 'success get groups', data: groups })
  }

  async privileges ({ response }) {
    const privileges = await Privilege.all()

    return response
      .status(200)
      .json({
        status: 'SUCCESS',
        message: 'Privileges successfully loaded',
        data: privileges
      })
  }

  async store ({ request, response }) {
    const rules = {
      name: 'required|unique:groups,name',
      shortname: 'required|unique:groups,shortname|min:3|max:3',
      description: 'required',
      is_admin: 'required|boolean'
    }

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', data: validation.messages()[0].message })
    }

    const {
      name,
      shortname,
      description,
      is_admin
    } = request.all()

    const group = await Group.create({
      name,
      shortname,
      description,
      is_admin
    })

    return response
      .status(200)
      .json({ status: 'SUCCESS', message: 'successfully added new group', data: group })
  }

  async show ({ params, response }) {
    try {
      const id = params.id
      const group = await Group
        .query()
        .where('id', id)
        .with('privileges')
        .first()

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Grup ditemukan',
          data: group
        })
    } catch (err) {
      return response
        .status(404)
        .json({
          status: 'FAILED',
          message: 'Grup tidak ditemukan'
        })
    }
  }

  async update ({ request, response, params }) {
    const id = params.id

    const rules = {
      name: `required|unique:groups,name,id,${id}`,
      shortname: `required|unique:groups,shortname,id,${id}|max:3|min:3`,
      description: 'required',
      is_admin: 'required|boolean',
      disabled: 'required|boolean'
    }

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', data: validation.messages()[0].message })
    }

    const {
      name,
      shortname,
      description,
      is_admin,
      disabled
    } = request.all()

    const success = await Group
      .query()
      .where('id', id)
      .update({
        name,
        shortname,
        description,
        is_admin,
        disabled
      })

    if (!success) {
      return response
        .status(404)
        .json({ status: 'FAILED', message: 'grup tidak ditemukan' })
    }

    return response
      .status(200)
      .json({ status: 'SUCCESS', message: 'Update sukses' })
  }

  async addPrivilege ({ request, response, params }) {
    try {
      const group = await Group.findOrFail(params.id)
      try {
        await group.privileges().attach([params.privilege_id])
        return response
          .status(200)
          .json({ status: 'SUCCESS', message: 'data berhasil diupdate' })
      } catch (err) {
        return response
          .status(404)
          .json({ status: 'FAILED', message: 'privilege tidak ditemukan' })
      }
    } catch {
      return response
        .status(404)
        .json({ status: 'FAILED', message: 'Grup tidak ditemukan' })
    }
  }

  async deletePrivilege ({ request, response, params }) {
    try {
      const group = await Group.findOrFail(params.id)
      try {
        await group.privileges().detach([params.privilege_id])
        return response
          .status(200)
          .json({ status: 'SUCCESS', message: 'data berhasil diupdate' })
      } catch (err) {
        return response
          .status(404)
          .json({ status: 'FAILED', message: 'privilege tidak ditemukan' })
      }
    } catch {
      return response
        .status(404)
        .json({ status: 'FAILED', message: 'Grup tidak ditemukan' })
    }
  }
}

module.exports = GroupController
