"use strict";

const MemberKomprof = use("App/Models/MemberKomprof");

class MemberKomprofController {
  async index({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();
      const page = data.page ? data.page : 1;
      const perPage = data.perPage ? data.perPage : 10;
      const sortField = data.sortField ? data.sortField : "created_at";
      const sortDirection = data.sortDirection ? data.sortDirection : "desc";
      const participants = await MemberKomprof.getParticipants(
        { komprof_id: id },
        page,
        perPage,
        sortField,
        sortDirection
      );

      return response.status(200).json({
        status: "SUCCESS",
        message: "Data peserta komprof berhasil dimuat!",
        data: participants,
      });
    } catch (error) {
      return response.status(500).json({
        status: "FAILED",
        message: error,
      });
    }
  }
}

module.exports = MemberKomprofController;
