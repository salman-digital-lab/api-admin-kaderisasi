'use strict'

const Factory = use('Factory')
const Database = use('Database')
const MemberRole = use('App/Models/MemberRole')

class MemberRoleSeeder {
  async run () {
  	await Database.insert([
  		{ id: 4, name: 'Jamaah', shortname: 'JAM', description: 'Belum mengikuti SSC', index : 1},
  		{ id: 5, name: 'Aktivis', shortname: 'AKT', description: 'Sudah mengikuti SSC', index : 2},
  		{ id: 6, name: 'Kader', shortname: 'KAD', description: 'Sudah mengikuti LMD', index : 3},
		{ id: 1, name: 'Alumni', shortname: 'ALM', description: 'Sudah Lulus', index : 4}
  	]).into(MemberRole.table)
  }
}

module.exports = MemberRoleSeeder
