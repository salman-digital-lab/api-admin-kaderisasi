'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')

class DasbordAdminController {
    async CountMembers ({response}){
        let count_members = await Database.raw(`SELECT member_roles.name, COUNT(member_roles.name) AS jumlah
        FROM member_roles INNER JOIN members on member_roles.id = members.role_id GROUP BY member_roles.name`)
        let role_members= await Database.raw(`SELECT COUNT(id) AS jumlah_member FROM members`)
        count_members.unshift(role_members[0]);
        let remove = count_members.splice(2);
        return response.status(200).json({
            status: "SUCCESS", 
            message: "jumlah memmber ",
            data:count_members,
        })

    }
    
    async CountMemberProvinces ({request, response}){
        const id = request.all()
        if(id.id == 0){
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
        else if(id.id == 1 || id.id == 2 || id.id == 3){
            const count_role = await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_permember
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id  WHERE member_roles.id = ${id.id} GROUP BY region_provinces.name`)
            return response.status(200).json({
                status: "SUCCESS",
                message: "jumlah member per provinsi dengan 1 jenis role",
                data:count_role[0],
            })
        }
        else {
            return response.status(400).json({
                message: "pilihan yang anda masukan salah ",
                status: "FAILED", 
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
