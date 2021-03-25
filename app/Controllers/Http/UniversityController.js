'use strict'

const Database = use('Database');
const { validate } = use('Validator');

class UniversityController {

    async getUniversities({ response }) {
        try {
            const universities = await Database
                .select('*')
                .from('universities')

            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data universitas",
                data: universities
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal mendapatkan data universitas karena kesalahan server"
            })
        }
    }

    async createUniversity({ request, response }) {
        const rules = {
            name: 'required'
        }

        const validation = await validate(request.all(), rules)
        
        if (validation.fails()) {
            response.status(400).json({
                status: "FAILED",
                message: "Gagal menambahkan universitas. Harap memasukkan nama universitas"
            })
        }
        
        const body = validation._data;
        
        try {
            const id = await Database
                .table('universities')
                .insert({
                    name: body.name
                })

            const university = await Database
                .table('universities')
                .where({
                    id
                })
            
            response.status(201).json({
                status: "SUCCESS",
                message: "Berhasil menambahkan universitas",
                data: university
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menambahkan universitas karena kesalahan server"
            })
        }
    }

    async updateUniversity({ params, request, response }) {
        const rules = {
            name: 'required'
        }

        const validation = await validate(request.all(), rules)
        
        if (validation.fails()) {
            response.status(400).json({
                status: "FAILED",
                message: "Gagal mengubah data universitas. Harap memasukkan nama universitas"
            })
        }
        
        const body = validation._data;
        
        try {
            await Database
                .table('universities')
                .where({
                    id: params.id
                })
                .update({
                    name: body.name
                })

            const university = await Database
                .table('universities')
                .where({
                    id: params.id
                })
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mengubah data universitas",
                data: university
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal mengubah data universitas karena kesalahan server"
            })
        }
    }

    async deleteUniversity({ params, response }) {
        try {
            const university = await Database
                .table('universities')
                .where({
                    id: params.id
                })

            await Database
                .table('universities')
                .where({
                    id: params.id
                })
                .delete()
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil menghapus universitas",
                data: university
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menghapus universitas karena kesalahan server"
            })
        }
    }

}

module.exports = UniversityController
