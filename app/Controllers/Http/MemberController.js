'use strict'

const Member = use('App/Models/Member');
const ActivityRegistration = use('App/Models/ActivityRegistration');
const Database = use('Database');

class MemberController {

    async getMembers({ response, request }) {

        const params = request.get();
        const gender = params.gender || "";
        const page = params.page || 1;
        const page_size = params.page_size || 20;
        const dateOfBirthday = params.date_of_birthday || "";
        const ssc = params.ssc;
        const lmd = params.lmd;
        const searchQuery = params.search_query || "";

        try {
            const members = await Database
                .select([
                    'members.*',
                    'universities.name AS university'
                ])
                .from('members')
                .leftJoin('universities', 'members.university_id', 'universities.id')
                .where(function() {
                    this.where('members.name', 'LIKE', `%${searchQuery}%`)
                    .orWhere('city_of_birth', 'LIKE', `%${searchQuery}%`)
                    .orWhere('email', 'LIKE', `%${searchQuery}%`)
                    .orWhere('from_address', 'LIKE', `%${searchQuery}%`)
                    .orWhere('current_address', 'LIKE', `%${searchQuery}%`)
                    .orWhere('universities.name', 'LIKE', `%${searchQuery}%`)
                    .orWhere('major', 'LIKE', `%${searchQuery}%`)
                    .orWhere('faculty', 'LIKE', `%${searchQuery}%`)
                    .orWhere('line_id', 'LIKE', `%${searchQuery}%`)
                })
                .andWhere('gender', 'LIKE', `%${gender}%`)
                .andWhere('date_of_birthday', 'LIKE', `%${dateOfBirthday}%`)
                .andWhere(function() {
                    if (ssc) {
                        this.whereNotNull('ssc').andWhere('ssc', 'LIKE', `%${ssc}%`)
                    }
                })
                .andWhere(function() {
                    if (lmd) {
                        this.whereNotNull('lmd').andWhere('lmd', 'LIKE', `%${lmd}%`)
                    }
                })
                .paginate(page, page_size)

            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data member",
                data: members
            })

        } catch (error) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal mendapatkan data member karena kesalahan server"
            })            
        }
    }

    async getMember({ params, response }) {
        try {
            const member = await Member.find(params.id);
            const activities = await member.activities().fetch()

            member.activities = activities

            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data member",
                data: {
                    member
                }
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal mendapatkan data member karena kesalahan server"
            }) 
        }
    }

    async blockMember({ params, response }) {
        try {
            const member = await Member.find(params.id);
            member.is_active = false;

            await member.save()

            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil memblokir member"
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal memblokir member karena kesalahan server"
            }) 
        }
    }
}

module.exports = MemberController
