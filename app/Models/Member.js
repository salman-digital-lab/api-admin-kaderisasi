'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

var MD5 = require("crypto-js/md5")

class Member extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await MD5(userInstance.password).toString()
      }
    })
  }

  static get hidden() {
    return ['salt', 'password', 'is_active', 'created_at', 'updated_at']
  }

  activities() {
    return this.hasMany('App/Models/ActivityRegistration')
  }

  member_role() {
    return this.hasOne("App/Models/MemberRole", "role_id", "id");
  }

  university() {
    return this.hasOne("App/Models/University", "university_id", "id");
  }

  checklists() {
    return this
      .belongsToMany('App/Models/Checklist')
      .pivotTable('member_checklists')
  }
}

module.exports = Member
