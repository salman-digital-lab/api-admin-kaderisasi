'use strict'

const { validateAll, validate, sanitizor } = use('Validator')
const ClassSection = use('App/Models/ClassSection')
const ClassSectionVideo = use('App/Models/ClassSectionVideo')
const Class = use('App/Models/Class')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with classsectionvideos
 */
class ClassSectionVideoController {
  /**
   * Show a list of all classsectionvideos.
   * GET classsectionvideos
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
    const videos = await ClassSectionVideo
      .query()
      .where('section_id', params.id_section)
      .where('title', 'LIKE', `%${search}%`)
      .paginate(page, perPage)

    return response.json({ status: 'SUCCESS', message: 'success get videos', data: videos })
  }

  /**
   * Create/save a new classsectionvideo.
   * POST classsectionvideos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

    const data = request.all()

    const rules = {
      title: 'required',
      link: 'required',
      section_id: 'required|number'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response
        .status(400)
        .json({ status: 'FAILED', message: validation.messages() })
    }

    const section = await ClassSection.find(data.section_id)
    if (section == null) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'section dengan id yang dimasukkan tidak ditemukan'
      })
    }

    try {
      const video = await ClassSectionVideo.create({
        title: data.title,
        link: data.link,
        section_id: data.section_id
      })

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil Upload Video',
        data: video
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Display a single classsectionvideo.
   * GET classsectionvideos/:id
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
      const video = await ClassSectionVideo.find(id)

      if (video !== null) {
        return response
          .status(200)
          .json({
            status: 'SUCCESS',
            message: 'Video ditemukan',
            data: video
          })
      }

      return response
        .status(404)
        .json({
          status: 'FAILED',
          message: 'Video tidak ditemukan ditemukan'
        })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  /**
   * Update classsectionvideo details.
   * PUT or PATCH classsectionvideos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {

    const id = params.id
    const data = request.all()

    const rules = {
      title: 'required',
      link: 'required',
      section_id: 'required|number'
    }

    const validation = await validateAll(data, rules)
    if (validation.fails()) {
      return response.json({
        status: 'FAILED',
        message: validation.messages()
      })
    }

    const section = await ClassSection.find(data.section_id)
    if (section == null) {
      return response.status(400).json({
        status: 'FAILED',
        message: 'section dengan id yang dimasukkan tidak ditemukan'
      })
    }

    try {

      await ClassSectionVideo
        .query()
        .where('id', id)
        .update({
          title: data.title,
          link: data.link,
          section_id: data.section_id
        })

      const video = await ClassSectionVideo.find(id)

      return response.json({
        status: 'SUCCESS',
        message: 'Update Success',
        data: video
      })
    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }

  }

  /**
   * Delete a classsectionvideo with id.
   * DELETE classsectionvideos/:id
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
      const video = await ClassSectionVideo.find(id)

      if (video == null) {
        return response.status(404).json({
          status: 'FAILED',
          message: 'video dengan id yang dimasukkan tidak ditemukan'
        })
      }

      await video.delete()

      return response.json({
        status: 'SUCCESS',
        message: 'Berhasil menghapus data video'
      })

    } catch (error) {
      response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }
}

module.exports = ClassSectionVideoController
