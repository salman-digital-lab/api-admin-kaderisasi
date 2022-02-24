'use strict'

const User = use('App/Models/User')
const UsersGroup = use('App/Models/UsersGroup')
const Group = use('App/Models/Group')
const { validate, validateAll, sanitizor } = use('Validator')
const Hash = use('Hash')
const Helpers = use('Helpers')
const Database = use('Database')

class UserController {
  async login ({ request, response, auth }) {

    const rules = {
      email: 'required|email',
      password: 'required|min:6'
    }

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', message: validation.messages()[0].message })
    }

    const { email, password } = request.all()

    try {
      let user = await User.findBy('email', email)
      const token = await auth.withRefreshToken().attempt(email, password)

      if (!user.active) {
        return response.json({ status: 'FAILED', message: 'the account is inactive' })
      }

      user = await User.getSerializedUser(user.id)

      return response.json({ status: 'SUCCESS', message: 'login success', token, user })
    } catch (error) {
      return response.json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

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
    const users = await User
      .query()
      .where('first_name', 'LIKE', `%${search}%`)
      .orWhere('last_name', 'LIKE', `%${search}%`)
      .orWhere('display_name', 'LIKE', `%${search}%`)
      .paginate(page, perPage)

    return response.json({ status: 'SUCCESS', message: 'success get users', data : users })
  }

  async store ({ request, response }) {
    const rules = {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:6',
      first_name: 'required',
      last_name: 'required',
      group_id: 'required'
    }

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', message: validation.messages()[0].message })
    }

    const {
      username,
      email,
      password,
      first_name,
      last_name,
      group_id
    } = request.all()

    const display_name = first_name + " " + last_name
    const active = 1


    const trx = await Database.beginTransaction()
    try {
      var user = await User.create({
        username,
        email,
        password,
        first_name,
        last_name,
        display_name,
        active
      }, trx)

      const user_group = await UsersGroup.create({
        user_id: user.id,
        group_id
      }, trx)

      await trx.commit()

      user = await User.getSerializedUser(user.id)

      return response.json({ status: 'SUCCESS', message: 'User berhasil dibuat', data : user })

    } catch (err) {
      await trx.rollback()
      if (err.code == "ER_NO_REFERENCED_ROW_2")
      {
        return response
          .status(400)
          .json({ status : 'FAILED', message : 'Grup tidak valid'})
      }

      return response
        .status(500)
        .json({ status : "FAILED", message : err.code})
    }
  }

  async show ({ params, response }) {
    try {
      const id = params.id
      const user = await User.getSerializedUser(id)

      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'user ditemukan',
          data : user
        })
    } catch (error) {
      return response
      .status(404)
      .json({
        status: 'FAILED',
        message: 'User tidak ditemukan'
      })
    }
  }

  async update ({ request, response, params }) {
    const id = params.id

    const rules = {
      username: `required|unique:users,username,id,${id}`,
      email: `required|email|unique:users,email,id,${id}`,
      display_name : 'required|string',
      first_name: 'required|string',
      last_name: 'required|string',
      group_id: 'required|integer',
      active: 'required|boolean'
    }
    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', message: validation.messages()[0].message })
    }

    const {
      username,
      email,
      display_name,
      first_name,
      last_name,
      group_id,
      active
    } = await request.all()

    const trx = await Database.beginTransaction()

    try {
      await User
        .query(trx)
        .where('id', id)
        .update({
          username,
          display_name,
          email,
          first_name,
          last_name,
          active
        }, trx)

      await UsersGroup
        .query(trx)
        .where('user_id', id)
        .update({ group_id })

      trx.commit()
      return response.json({ status: 'SUCCESS', message: 'Update Success'})
    } catch (err)
    {
      trx.rollback()
      if (err.code == "ER_NO_REFERENCED_ROW_2")
      {
        return response
          .status(400)
          .json({ status : 'FAILED', message : 'Grup tidak valid'})
      }

      return response
        .status(500)
        .json({ status : 'FAILED', message : 'Server error'})
    }

  }

  // async destroy ({ params, response }) {
  //   try {
  //     const id = params.id
  //     const user = await User.find(id)
  //     await user.delete()

  //     return response.json({ status: 'SUCCESS', message: `delete user with id ${id} success` })
  //   } catch (error) {
  //     return response.json({
  //       status: 'FAILED',
  //       message: error.message
  //     })
  //   }
  // }

  // async upload ({ request, params, response }) {
  //   const rules = {
  //     file_image: 'required'
  //   }
  //   const validation = await validateAll(request.all(), rules)
  //   if (validation.fails()) {
  //     return response.json({ status: 'FAILED', message: validation.messages() })
  //   }

  //   const image = request.file('image', {
  //     types: ['image'],
  //     size: '2mb',
  //     extnames: ['png', 'jpg', 'jpeg']
  //   })

  //   await image.move(Helpers.tmpPath('uploads'), {
  //     name: `${new Date().getTime()}-${image.clientName}`,
  //     overwrite: true
  //   })

  //   if (!image.moved()) {
  //     return response.json({
  //       status: 'FAILED',
  //       message: image.error()
  //     })
  //   }

  //   const id = params.id
  //   try {
  //     await User
  //       .query()
  //       .where('id', id)
  //       .update({
  //         file_image: Helpers.tmpPath(image.fileName)
  //       })
  //   } catch (error) {
  //     return response.json({
  //       status: 'FAILED',
  //       message: error.message
  //     })
  //   }

  //   return response.json({
  //     status: 'SUCCESS',
  //     message: 'Gambar berhasil di upload'
  //   })
  // }
}

module.exports = UserController
