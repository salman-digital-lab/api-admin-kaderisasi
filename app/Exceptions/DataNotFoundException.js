'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const status = 404
const code = 'E_MISSING_DATABASE_ROW'

class DataNotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  constructor (message) {
  	super(message, status, code)
  }
}

module.exports = DataNotFoundException
