'use strict'

const { Command } = require('@adonisjs/ace')

const Database = use('Database')
const User = use('App/Models/User')
const Hash = use('Hash')
const Env = use('Env')

class ResetAdminPassword extends Command {
  static settings = {
    loadApp: true
  }

  static get signature () {
    return 'reset-admin-password'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    this.info('Starting reset admin password command...');
    
    const users = (await User.all()).toJSON();
    this.info(`Updating ${users.length} row...`);

    try {
      const password = await Hash.make(Env.get('ADMIN_DEFAULT_PASSWORD'))
      await User
        .query()
        .update({ password: password })
    } catch(err) {
      this.info('Error occured!');
      this.info(err);
      
      Database.close();
      return ;
    }
    
    this.info('Update successful!');
    Database.close();
  }
}

module.exports = ResetAdminPassword
