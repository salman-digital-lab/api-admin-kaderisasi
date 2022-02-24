'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ForbiddenException = use('App/Exceptions/ForbiddenException')

class Privilege {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, request }, next, properties) {

    var { group , privileges} = await auth.user.privileges()

    if( group.is_disabled ) {
      throw new ForbiddenException('Access denied : group is disabled. Contact admin for details')
    }
    
    if(!group.is_admin) {
      privileges = privileges.map( function (privilege) {
        return privilege.name
      })

      var resource = properties[0]

      if (!privileges.includes(resource)) 
      {
        throw new ForbiddenException('Access denied: privelege is not enough')
      }
    }

    await next()
  }
}

module.exports = Privilege
