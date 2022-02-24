'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')


const status = 403

// app specific
const code = 'E_FORBIDDEN'

class ForbiddenException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  constructor (message) {
    super(message, status, code)
  }
}

module.exports = ForbiddenException
