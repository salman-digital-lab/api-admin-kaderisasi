'use strict'

const Database = use('Database')
const MemberRole = use('App/Models/MemberRole')

class MemberRoleSeeder {
  async run () {
  	await Database.insert([
  		{ id: 4, name: 'Jamaah', shortname: 'JAM', description: 'Belum mengikuti SSC', index : 1},
  		{ id: 5, name: 'Aktivis', shortname: 'AKT', description: 'Sudah mengikuti SSC', index : 2},
  		{ id: 6, name: 'Kader', shortname: 'KAD', description: 'Sudah mengikuti LMD', index : 4},
		{ id: 7, name: 'Kader-Lanjutan', shortname: 'KAL', description: 'User Group Kader Lanjutan adalah Kader yang sudah mengikuti SPECTRA (Spiritual Entrepreneurial Civilizer Training)s', index : 7},
		{ id: 51, name: 'Akivis-KK', shortname: 'AKK', description: 'Alumni SSC yang sudah menyelesaikan kegiatan Mentoring Kelompok Keluarga.', index : 3},
		{ id: 52, name: 'Kader-Inventra', shortname: 'KAI', description: 'Alumni LMD yang sudah menyelesaikan kegiatan Inventra.', index : 5},
		{ id: 53, name: 'Kader-Komprof', shortname: 'KAK', description: 'Alumni LMD yang sudah menyelesaikan kegiatan Komprof.', index : 6},
  	]).into(MemberRole.table)
  }
}

module.exports = MemberRoleSeeder
