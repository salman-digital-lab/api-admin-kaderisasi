'use strict'

const { validateAll, validate, sanitizor } = use('Validator')
const Class = use('App/Models/Class')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with classes
 */
class ClassController {
  /**
   * Show a list of all classes.
   * GET classes
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
    const kelas = await Class
      .query()
      .where('title', 'LIKE', `%${search}%`)
      .orWhere('description', 'LIKE', `%${search}%`)
      .paginate(page, perPage)

    return response.json({ status: 'SUCCESS', message: 'success get class', data: kelas })
  }

  /**
   * Create/save a new class.
   * POST classes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.all()

    const rules = {
      title: 'required|unique:classes',
      description: 'required'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', message: validation.messages() })
    }

    try {
      const kelas = await Class.create({
        title: data.title,
        description: data.description
      })

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil Membuat Kelas',
        kelas
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Display a single class.
   * GET classes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const id = params.id
    const rules = {
      id: 'required|number'
    }

    const validation = await validate(id, rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()
        })
    }

    try {
      const kelas = await Class.find(id)

      if (kelas !== null) {
        return response
          .status(200)
          .json({
            status: 'SUCCESS',
            message: 'Kelas ditemukan',
            data: kelas
          })
      }

      return response
        .status(404)
        .json({
          status: 'FAILED',
          message: 'Kelas tidak ditemukan ditemukan'
        })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Update class details.
   * PUT or PATCH classes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const id = params.id
    const data = request.all()

    const rules = {
      title: `required|unique:classes, title, id, ${id}`,
      description: 'required'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response.json({
        status: 'FAILED',
        message: validation.messages()
      })
    }

    try {
      await Class
        .query()
        .where('id', id)
        .update({
          title: data.title,
          description: data.description
        })

      const kelas = await Class.find(id)

      return response.json({
        status: 'SUCCESS',
        message: 'Update Success',
        data: kelas
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Delete a class with id.
   * DELETE classes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const id = params.id

    const rules = {
      id: 'required|number'
    }

    const validation = await validate(id, rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: 'FAILED',
          message: validation.messages()
        })
    }

    try {
      const kelas = await Class.find(id)

      if (kelas == null) {
        return response.status(404).json({
          status: 'FAILED',
          message: 'Kelas dengan id yang dimasukkan tidak ditemukan'
        })
      }

      await kelas.delete()

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil menghapus data kelas'
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }
}

module.exports = ClassController
