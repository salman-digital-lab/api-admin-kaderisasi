'use strict'

const Factory = use('Factory')
const Database = use('Database')
const MemberRole = use('App/Models/MemberRole')

class MemberRoleSeeder{
  async run () {
  	await Database.insert([
  		{id: 3, name: "Jamaah", shortname: "JAM", description : "Belum mengikuti SSC"},
  		{id: 4, name: "Aktivis", shortname: "AKT", description : "Sudah mengikuti SSC"},
  		{id: 5, name: "Kader", shortname: "KAD", description : "Sudah mengikuti LMD"}
  	]).into(MemberRole.table)
  }
}

module.exports = MemberRoleSeeder
