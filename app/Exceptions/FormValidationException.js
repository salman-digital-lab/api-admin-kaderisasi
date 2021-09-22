'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const status = 400

const default_code = 'E_FORM_ERROR'

class FormValidationException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  constructor (message, code) {
    super(message, status, code)
  }
}

module.exports = FormValidationException
