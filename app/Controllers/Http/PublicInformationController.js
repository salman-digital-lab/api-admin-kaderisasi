'use strict'
const PublicInformation = use('App/Models/PublicInformation');
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with publicinformations
 */
class PublicInformationController {
  /**
   * Show a list of all publicinformations.
   * GET publicinformations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async GetAllInformation ({ request, response }) {
      let AllInformation = await Database.raw(`SELECT * FROM public_informations`)
          return response.status(200).json({
              status: "SUCCESS", 
              message: "tampil semua data public information",
              data:AllInformation[0],
          })
  }

  /**
   * Render a form to be used for creating a new publicinformation.
   * GET publicinformations/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async insert ({ request, response}) {
    console.log("jjj")
      const data = request.only(['information_name', 'information_slug', 'information_description' ])
      const userExit = await PublicInformation.findBy('information_slug', data.information_slug)
      console.log(userExit)
      if (userExit){
        return response.status(200).json({
          status: "FAILED", 
          message: "sudah ada data",
      })
      }
      const information_name = request.input('information_name')
      const information_slug = request.input('information_slug')
      const information_description = request.input('information_description')
      await Database
      .table('public_informations')
      .insert({information_name: `${information_name}`, information_slug: `${information_slug}`,
      information_description: `${information_description}`,createdDate: Database.fn.now()})

      let detail_data_User = await Database.from('public_informations').where('information_slug',`${information_slug}`)
      return response.status(200).json({
        status: "SUCCESS", 
        message: "data berhasil di input",
        data:detail_data_User[0],
        
    })
  
  }

  /**
   * Create/save a new publicinformation.
   * POST publicinformations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ request, response }) {
      const data = request.only(['information_name', 'information_slug', 'information_description' ])
      const userExit = await PublicInformation.findBy('information_slug', data.information_slug)
      if (userExit){
        return response.status(200).json({
          status: "FAILED", 
          message: "data sudah ada",
          
      })
      }
      
      const information_name = request.input('information_name')
      const information_slug = request.input('information_slug')
      const information_slug_before = request.input('information_slug_before')
      const information_description = request.input('information_description')
  
      await Database
      .table('public_informations')
      .where('information_slug', `${information_slug_before}`)
      .update({information_name: `${information_name}`, information_slug: `${information_slug}`, information_description: `${information_description}`})
      let detail_data_User = await Database.from('public_informations').where('information_slug',`${information_slug}`)
      return response.status(200).json({
        status: "SUCCESS", 
        message: "update data berhasil",
        data: detail_data_User[0],
        
    })
  }

  /**
   * Display a single publicinformation.
   * GET publicinformations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async delete ({request, response }) {
      const information_slug = request.input('information_slug')
      await Database
      .table('public_informations')
      .where('information_slug',`${information_slug}`)
      .delete()
      return response.status(200).json({
        status: "SUCCESS", 
        message: "delete data berhasil",
    })
  
  
  }

  /**
   * Render a form to update an existing publicinformation.
   * GET publicinformations/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async Detailformation ({request, response}) {
    
      const information_slug = request.all()
      let detail = await Database.from('public_informations').where('information_slug',`${information_slug.information_slug}`)
      console.log(detail)
      return response.status(200).json({
          status: "SUCCESS",
          message: "detail data public information",
          data:detail[0] 
      })
  }

 
}

module.exports = PublicInformationController
