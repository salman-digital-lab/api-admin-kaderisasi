'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const Privilege = use('App/Models/Privilege')
const DataNotFoundException = use('App/Exceptions/DataNotFoundException')

class User extends Model {
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
    return ['password', 'salt']
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  users_group() {
    return this.hasOne('App/Models/UsersGroup')
  }


  /* user serialization here, reduce boilerplate */
  static async  getSerializedUser(userId) {
    const userRow = await this
        .query()
        .where('id', userId)
        .with('users_group.groups.privileges')
        .fetch()

    // Clean representation
    var user = userRow.toJSON()

    if(user.length == 0){
      throw new DataNotFoundException("User not found")
    }

    
    user = user[0]

    // Build group
    user.group = user.users_group.groups
    delete user.users_group


    // Move privileges up, delete privileges in groups
    user.privileges = user.group.privileges
    delete user.group.privileges

    for(const privilege of user.privileges) {
      delete privilege.pivot              
    }

    return user

  }

  async privileges() {
    const user = await User.getSerializedUser(this.id)
    return {
      privileges : user.privileges,
      group : user.group
    }
  }

}

module.exports = User
