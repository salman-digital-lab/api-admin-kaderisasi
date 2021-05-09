'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class Member extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
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
}

module.exports = Member
