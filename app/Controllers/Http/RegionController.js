'use strict'

const Database = use('Database');
const { validate } = use('Validator');

class RegionController {

    async getProvinces({ response }) {
        try {
            const provinces = await Database
            .select('*')
            .from('region_provinces')
        
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data provinsi",
                data: provinces
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal mendapatkan data provinsi karena kesalahan server"
            })
        }
    }

    async getRegenciesByProvinceId({ params, response }) {
        try {
            const regencies = await Database
                .select('*')
                .from('region_regencies')
                .where('province_id', params.id)
                
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data kabupaten",
                data: regencies
            })
        } catch(err) {
            response.status(500).json({
                status: "SUCCESS",
                message: "Gagal mendapatkan data kabupaten karena kesalahan server"
            })
        }
    }

    async getDistrictsByRegencyId({ params, response }) {
        try {
            const districts = await Database
                .select('*')
                .from('region_districts')
                .where('regency_id', params.id)
                
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data kecamatan",
                data: districts
            })
        } catch(err) {
            response.status(500).json({
                status: "SUCCESS",
                message: "Gagal mendapatkan data kecamatan karena kesalahan server"
            })
        }
    }

    async getVillagesByDistrictId({ params, response }) {
        try {
            const villages = await Database
                .select('*')
                .from('region_villages')
                .where('district_id', params.id)
                
            response.json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data desa",
                data: villages
            })
        } catch(err) {
            response.status(500).json({
                success: false,
                message: "Gagal mendapatkan data desa karena kesalahan server"
            })
        }
    }

    async deleteProvince({ params, response }) {
        try {
            const province = await Database
                .table('region_provinces')
                .where({
                    id: params.id
                })

            await Database
                .table('region_provinces')
                .where({
                    id: params.id
                })
                .delete()
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil menghapus provinsi",
                data: province
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menghapus universitas karena kesalahan server"
            })
        }
    }

    async deleteRegency({ params, response }) {
        try {
            const regency = await Database
                .table('region_regencies')
                .where({
                    id: params.id
                })

            await Database
                .table('region_regencies')
                .where({
                    id: params.id
                })
                .delete()
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil menghapus kabupaten",
                data: regency
            })
        } catch(err) {
            console.log(err);
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menghapus kabupaten karena kesalahan server"
            })
        }
    }

    async deleteDistrict({ params, response }) {
        try {
            const district = await Database
                .table('region_districts')
                .where({
                    id: params.id
                })

            await Database
                .table('region_districts')
                .where({
                    id: params.id
                })
                .delete()
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil menghapus kecamatan",
                data: district
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menghapus kecamatan karena kesalahan server"
            })
        }
    }

    async deleteVillage({ params, response }) {
        try {
            const village = await Database
                .table('region_villages')
                .where({
                    id: params.id
                })

            await Database
                .table('region_villages')
                .where({
                    id: params.id
                })
                .delete()
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil menghapus desa",
                data: village
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menghapus desa karena kesalahan server"
            })
        }
    }
}

module.exports = RegionController
