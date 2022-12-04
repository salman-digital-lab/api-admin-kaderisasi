'use strict'

const Roles = use("App/Models/MemberRole");

class MemberRolesController {
    async index({ response }) {
        try {
          const roles = await Roles.all()
          
          return response
            .status(200)
            .json({
              status: "SUCCESS",
              message: "Data jenjang member berhasil dimuat!",
              data: roles,
            });
        } catch (error) {
          return response
            .status(500)
            .json({
              status: "FAILED",
              message: error
            });
        }
      }
    
      async show({ params, response }) {
        try {
          const { id } = params;
          const roles = await Roles.find(id);
          if (!roles) {
            return response
              .status(400)
              .json({
                status: "FAILED",
                message: "Tidak ada data yang ditemukan"
              });
    
          }
          return response
            .status(200)
            .json({
              status: "SUCCESS",
              message: "Data Kategori Aktivitas berhasil dimuat!",
              data: roles,
            });
        } catch (error) {
          return response
            .status(500)
            .json({
              status: "FAILED",
              message: error
            });
        }
      }
}

module.exports = MemberRolesController
