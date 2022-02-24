'use strict'

const Province = use('App/Models/Region/Province')
const Regency = use('App/Models/Region/Regency')
const District = use('App/Models/Region/District')
const Village = use('App/Models/Region/Village')

class RegionController {

    async getProvinces({ response }) {
        try {
            const provinces = await Province.all()
        
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
            const province = await Province.find(params.id)

            const regencies = await province
                .regencies()
                .fetch()
                
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
            const regency = await Regency.find(params.id)

            const districts = await regency
                .districts()
                .fetch()
                
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
            const district = await District.find(params.id)
            
            const villages = await district
                .villages()
                .fetch()
                
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
            const province = await Province.find(params.id)
            await province.delete()
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
            const regency = await Regency.find(params.id)
            await regency.delete()
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil menghapus kabupaten",
                data: regency
            })
        } catch(err) {
            response.status(500).json({
                status: "FAILED",
                message: "Gagal menghapus kabupaten karena kesalahan server"
            })
        }
    }

    async deleteDistrict({ params, response }) {
        try {
            const district = await District.find(params.id)
            await district.delete()
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
            const village = await Village.find(params.id)
            await village.delete()
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
