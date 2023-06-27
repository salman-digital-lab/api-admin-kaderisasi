"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use("Database");

const MINIMUM_SPECTRA_GENERATION = 1;
const MINIMUM_LMD_GENERATION = 165;

class DasbordAdminController {
  async CountMembers({ response }) {
    let countMembersByRole = await Database.raw(
      `SELECT member_roles.name, COUNT(member_roles.name) AS total FROM member_roles INNER JOIN members on member_roles.id = members.role_id GROUP BY member_roles.name ORDER BY member_roles.index`
    );

    let countMembers = await Database.raw(
      `SELECT 
        COUNT(id) AS Akun,
        SUM(CASE WHEN is_graduated = 1 then 1 else 0 end) AS Alumni,
        SUM(CASE WHEN ssc >= ${MINIMUM_SPECTRA_GENERATION} then 1 else 0 end) AS "Alumni SSC",
        SUM(CASE WHEN lmd >= ${MINIMUM_LMD_GENERATION} then 1 else 0 end) AS "Alumni LMD",
        SUM(CASE WHEN spectra is not null then 1 else 0 end) AS "Alumni Spectra"
      FROM members`
    );

    countMembers = countMembers[0][0];

    const members = countMembersByRole[0].filter((role) => {
      return role.name.toLowerCase() !== "alumni";
    });

    Object.keys(countMembers).forEach((key) => {
      members.push({
        name: key,
        total: countMembers[key],
      });
    });

    return response.status(200).json({
      status: "SUCCESS",
      message: "member count",
      data: members,
    });
  }

  async AutocompleteUniversities({ request, response }) {
    const universities = request.all();
    const listuniversities = await Database.raw(
      `SELECT * FROM university WHERE name LIKE '%${universities.universities[0]}%'`
    );
    return response.status(200).json({
      status: "SUCCESS",
      message: "nama universitas",
      data: listuniversities[0],
    });
  }

  async CountMemberProvinces({ request, response }) {
    /* const id untuk mendapatkan id dari role_member dan responya itu akan menampilkan jumlah member
     * perprovinsi dengan hanya 1 jenis role misalnya memberikan nilai id dengan 1 maka hanya akan menampilkan
     * jumlah menber perprovinsi dengan role kader saja dan untuk menampilkan semua role maka maka tidak perlu untuk
     * memberikan nilai apapun ke id
     * sedangkan const universities untuk mendapatkan id universities tapi anda bisa meginputkan lebih dari 1 id universities
     * dan untuk menampilkan semua member universities yang ada maka tidak perlu untuk memberikan nilai apapun ke universities
     * jika kalian ingin menampilkan jumlah member berdasarkan role tertentu dan universities tertentu maka maka inputkan id rolenya
     * dan universities idnya.
     */
    const id = request.all();
    const universities = request.all();

    if (id.id == undefined && universities.universities == undefined) {
      const count_all =
        await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_member
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id GROUP BY region_provinces.name, member_roles.name`);
      return response.status(200).json({
        status: "SUCCESS",
        message: "succes jumlah memmber per provinsi",
        data: count_all[0],
      });
    } else if (id.id == undefined && universities.universities != undefined) {
      const count_all =
        await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_member
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id INNER JOIN university ON university.id = members.university_id 
            WHERE university.id IN (${universities.universities}) GROUP BY region_provinces.name, member_roles.name`);
      return response.status(200).json({
        status: "SUCCESS",
        message: "succes jumlah memmber per provinsi",
        data: count_all[0],
      });
    } else if (id.id != undefined && universities.universities == undefined) {
      const count_role =
        await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_member
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id WHERE member_roles.id = ${id.id} GROUP BY region_provinces.name`);
      return response.status(200).json({
        status: "SUCCESS",
        message: "jumlah member per provinsi dengan 1 jenis role",
        data: count_role[0],
      });
    } else {
      const count_role =
        await Database.raw(`SELECT DISTINCT(region_provinces.name) AS nama_provinsi,
            member_roles.name AS jenis_member,  COUNT(member_roles.name) AS jumlah_member
            FROM region_provinces INNER JOIN members ON region_provinces.id = members.province_id INNER JOIN member_roles
            ON member_roles.id = members.role_id INNER JOIN university ON university.id = members.university_id
             WHERE member_roles.id = ${id.id} AND university.id IN (${universities.universities}) GROUP BY region_provinces.name`);
      return response.status(200).json({
        status: "SUCCESS",
        message: "jumlah member per provinsi dengan 1 jenis role",
        data: count_role[0],
      });
    }
  }

  async CountMembersUniversities({ response }) {
    const count_universities =
      await Database.raw(`SELECT DISTINCT(university.name) AS nama_universitas,
        member_roles.name AS jenis_member, COUNT(member_roles.name) AS jumlah_member
        FROM university INNER JOIN members ON university.id = members.university_id INNER JOIN member_roles
        ON member_roles.id = members.role_id GROUP BY university.name, member_roles.name`);
    return response.status(200).json({
      status: "SUCCESS",
      message: " jumlah memmber per universitas ",
      data: count_universities[0],
    });
  }

  async CountMembersYears({ response }) {
    const count_years =
      await Database.raw(`SELECT DISTINCT(year(members.created_at)) AS tahun, member_roles.name as jenis_member, count(member_roles.id) as jumlah_member
        FROM member_roles INNER JOIN  members ON member_roles.id = members.role_id GROUP BY year(members.created_at),member_roles.name, member_roles.id `);
    return response.status(200).json({
      status: "SUCCESS",
      message: "succes jumlah memmber Pertahun ",
      data: count_years[0],
    });
  }

  async CountMembersGender({ response }) {
    const count_gender = await Database.raw(
      `SELECT gender, COUNT(gender) AS jumlah FROM members GROUP BY gender`
    );
    return response.status(200).json({
      status: "SUCCESS",
      message: "succes jumlah member per gender",
      data: count_gender[0],
    });
  }
}

module.exports = DasbordAdminController;
