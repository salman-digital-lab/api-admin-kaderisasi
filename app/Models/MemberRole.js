'use strict'

const Model = use('Model')

class MemberRole extends Model {
  static boot() {
    super.boot()
    this.addTrait('NoTimestamp')
  }

  static get table() {
    return 'member_roles'
  }
}

module.exports = MemberRole
