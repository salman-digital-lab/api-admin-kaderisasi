'use strict'

const { validateAll, validate, sanitizor } = use('Validator')
const ClassSection = use('App/Models/ClassSection')
const Class = use('App/Models/Class')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with classsections
 */
class ClassSectionController {
  /**
   * Show a list of all classsections.
   * GET classsections
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, request, params }) {
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
    const sections = await ClassSection
      .query()
      .where('class_id', params.id_class)
      .where('title', 'LIKE', `%${search}%`)
      .paginate(page, perPage)

    return response.json({ status: 'SUCCESS', message: 'success get sections', data: sections })
  }

  /**
   * Create/save a new classsection.
   * POST classsections
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

    const data = request.all()

    const rules = {
      title: 'required',
      class_id: 'required|number'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', message: validation.messages() })
    }

    const kelas = await Class.find(data.class_id)
    if (kelas == null) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'Kelas dengan id yang dimasukkan tidak ditemukan'
      })
    }

    try {
      const section = await ClassSection.create({
        title: data.title,
        class_id: data.class_id
      })

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil Membuat Section',
        data: section
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Display a single classsection.
   * GET classsections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {

    const id = params.id

    if (isNaN(id)) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'Parameter id harus berupa angka'
      })
    }

    try {
      const section = await ClassSection.find(id)

      if (section !== null) {
        return response
          .status(200)
          .json({
            status: 'SUCCESS',
            message: 'Section ditemukan',
            data: section
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
   * Update classsection details.
   * PUT or PATCH classsections/:id
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
      class_id: 'required|number'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response.json({
        status: 'FAILED',
        message: validation.messages()
      })
    }

    const kelas = await Class.find(data.class_id)
    if (kelas == null) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'Kelas dengan id yang dimasukkan tidak ditemukan'
      })
    }

    try {

      await ClassSection
        .query()
        .where('id', id)
        .update({
          title: data.title,
          class_id: data.class_id
        })

      const section = await ClassSection.find(id)

      return response.json({
        status: 'SUCCESS',
        message: 'Update Success',
        data: section
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }

  }

  /**
   * Delete a classsection with id.
   * DELETE classsections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {

    const id = params.id

    if (isNaN(id)) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'Params id harus berupa angka'
      })
    }

    try {
      const section = await ClassSection.find(id)

      if (section == null) {

        return response.status(404).json({
          status: 'FAILED',
          message: 'Section dengan id yang dimasukkan tidak ditemukan'
        })
      }

      await section.delete()

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

  async getByClass({ params, response }) {

    const id = params.id_class

    if (isNaN(id)) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'Params id harus berupa angka'
      })
    }

    const kelas = await Class.find(id)

    if (kelas == null) {
      return response.status(404).json({
        status: 'FAILED',
        message: 'Kelas dengan id yg dimasukkan tidak ditemukan'
      })
    }

    try {
      const section = await Class
        .query()
        .where('id', id)
        .with('sections')
        .fetch()
      return response
        .status(200)
        .json({
          status: 'SUCCESS',
          message: 'Kelas ditemukan',
          data: section
        })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }
}

module.exports = ClassSectionController
