'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')

class DasbordAdminController {
    async CountMembers ({response}){
        let count_members = await Database.raw(`SELECT member_roles.name, COUNT(member_roles.name) AS jumlah
        FROM member_roles INNER JOIN members on member_roles.id = members.role_id GROUP BY member_roles.name ORDER BY member_roles.id`)
        let role_members= await Database.raw(`SELECT COUNT(id) AS jumlah_member FROM members`)
        count_members[0].unshift({
            name: "Akun",
            value: role_members[0][0].jumlah_member
        });
        let remove = count_members.splice(2);
        return response.status(200).json({
            status: "SUCCESS", 
            message: "jumlah member ",
            data:count_members[0],
        })

    }

    async AutocompleteUniversities ({request, response}){
        const universities = request.all()
        const listuniversities = await Database.raw(`SELECT * FROM universities WHERE name LIKE '%${universities.universities[0]}%'`)
        return response.status(200).json({
            status: "SUCCESS",
            message: "nama universitas",
            data:listuniversities[0]
        })
    }

    async CountMemberProvinces ({request, response}){
        /** const id untuk mendapatkan id dari role_member dan responya itu akan menampilkan jumlah member
         * perprovinsi dengan hanya 1 jenis role misalnya memberikan nilai id dengan 1 maka hanya akan menampilkan 
         * jumlah menber perprovinsi dengan role kader saja dan untuk menampilkan semua role maka maka tidak perlu untuk 
         * memberikan nilai apapun ke id
         * sedangkan const universities untuk mendapatkan id universities tapi anda bisa meginputkan lebih dari 1 id universities
         * dan untuk menampilkan semua member universities yang ada maka tidak perlu untuk memberikan nilai apapun ke universities
         * jika kalian ingin menampilkan jumlah member berdasarkan role tertentu dan universities tertentu maka maka inputkan id rolenya 
         * dan universities idnya.
         */
        const id = request.all()
        const universities = request.all()
       
        if(id.id == undefined && universities.universities == undefined){
            const count_all = await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_permember
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id GROUP BY region_provinces.name, member_roles.name`)
            return response.status(200).json({
                status: "SUCCESS",
                message: "succes jumlah memmber per provinsi",
                data:count_all[0],
            })
        }

        else if (id.id == undefined && universities.universities != undefined){
            const count_all = await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_permember
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id INNER JOIN  universities ON universities.id = members.university_id 
            WHERE universities.id IN (${universities.universities}) GROUP BY region_provinces.name, member_roles.name`)
            return response.status(200).json({
                status: "SUCCESS",
                message: "succes jumlah memmber per provinsi",
                data:count_all[0],
            })
        }

        else if (id.id != undefined && universities.universities == undefined){
            const count_role = await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_permember
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id WHERE member_roles.id = ${id.id} GROUP BY region_provinces.name`)
            return response.status(200).json({
                status: "SUCCESS",
                message: "jumlah member per provinsi dengan 1 jenis role",
                data:count_role[0],
            })
        }

        else{
            const count_role = await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_permember
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id INNER JOIN  universities ON universities.id = members.university_id
             WHERE member_roles.id = ${id.id} AND universities.id IN (${universities.universities}) GROUP BY region_provinces.name`)
            return response.status(200).json({
                status: "SUCCESS",
                message: "jumlah member per provinsi dengan 1 jenis role",
                data:count_role[0],
            })
        }
    }

    
    async CountMembersUniversities ({response}){
        const count_universities = await Database.raw(`SELECT DISTINCT(universities.name) AS nama_universitas,
        member_roles.name AS jenis_member, COUNT(member_roles.name) AS jumlah_permember
        FROM universities INNER JOIN members ON universities.id = members.university_id INNER JOIN member_roles
        ON member_roles.id = members.role_id GROUP BY universities.name, member_roles.name`)
        return response.status(200).json({
            status: "SUCCESS",
            message: " jumlah memmber per universitas ",
            data:count_universities[0] 
        })
    }

    async CountMembersYears ({response}){
        const count_years = await Database.raw(`SELECT DISTINCT(year(members.created_at)) AS tahun, member_roles.name as jenis_member, count(member_roles.id) as jumlah_member
        FROM member_roles INNER JOIN  members ON member_roles.id = members.role_id GROUP BY year(members.created_at),member_roles.name, member_roles.id `)
        return response.status(200).json({
            status: "SUCCESS",
            message: "succes jumlah memmber Pertahun ",
            data:count_years[0]
        })
    }
    
    async CountMembersGender ({response}){
        const count_gender = await Database.raw(`SELECT gender, COUNT(gender) AS jumlah FROM members GROUP BY gender`)
        return response.status(200).json({
            status: "SUCCESS",
            message: "succes jumlah memmber  per gender",
            data:count_gender[0] 
        })
    }
}

module.exports = DasbordAdminController
