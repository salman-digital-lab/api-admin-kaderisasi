'use strict'

const Factory = use('Factory')
const Database = use('Database')

/* Seed according to ACL docs */
class PrivilegesAndGroupsSeeder {
  	async run () {
  		// First, seed groups
	  	await Database.insert([
	  		{ id: 1, name: 'ADMIN', shortname: 'ADM', description: 'Admin', is_admin: true },
  			{ id: 2, name: 'KONSELOR', shortname: 'KON', description: 'Konselor' },
  			{ id: 3, name: 'KAPRO', shortname: 'KAP', description: 'Kapro' },
  			{ id: 4, name: 'MANAJER', shortname: 'MAN', description: 'Manajer' }
    ]).into('groups')

    // Second, seed privileges
    await Database.insert([
      { id: 1, name: 'activity', description: 'Modul activity' },
      { id: 2, name: 'members', description: 'Modul member' },
      { id: 3, name: 'student-care', description: 'Modul student care' },
      { id: 4, name: 'university', description: 'Modul university' },
      { id: 5, name: 'users', description: 'Modul users' }
    ]).into('privileges')

    // Third, map
    // admin can use backdoor in middleware
    await Database.insert([
      { group_id: 1, privilege_id: 1 },
      { group_id: 1, privilege_id: 2 },
      { group_id: 1, privilege_id: 3 },
      { group_id: 1, privilege_id: 4 },
      { group_id: 1, privilege_id: 5 },
      { group_id: 2, privilege_id: 3 }, // konselor -> student care
      { group_id: 3, privilege_id: 1 }, // kapro -> activity
      { group_id: 4, privilege_id: 1 }, // manajer -> activity
      { group_id: 4, privilege_id: 2 }, // manajer -> members
      { group_id: 4, privilege_id: 3 }, // manajer -> student-care
      { group_id: 4, privilege_id: 4 }, // manajer -> university
      { group_id: 4, privilege_id: 5 } // manajer -> user
    ]).into('groups_privileges')
  	}
}

module.exports = PrivilegesAndGroupsSeeder
