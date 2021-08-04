'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ActiveUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, request }, next) {
    if(!auth.user.active)
    {
      throw new ForbiddenException("Access denied : user is not active")
    }
    
    await next()
  }
}

module.exports = ActiveUser
