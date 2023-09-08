'use strict'

const Alumni = use('App/Models/Alumni')
const { rule, validate } = use("Validator");

class AlumniController {
    async index({request, response}) {
        const params = request.get();

        const rules = {
            page: "number",
            page_size: "number",
            search_query: "string",
        };

        const validation = await validate(params, rules);

        if (validation.fails()) {
            return response.status(400).json({
              status: "FAILED",
              message: validation.messages(),
            });
        }

        const page = params.page || 1;
        const page_size = params.page_size || 20;
        const searchQuery = params.search_query || "";

        try {
            const alumni = await Alumni.query()
                .select('*')
                .where(function () {
                    this.where("alumni.name", "LIKE", `%${searchQuery}%`)
                        .orWhere("alumni.email", "LIKE", `%${searchQuery}%`)
                        .orWhere("full_address", "LIKE", `%${searchQuery}%`)
                })
                .paginate(page, page_size)
            
            response.status(200).json({
                status: "SUCCESS",
                message: "Berhasil mendapatkan data alumni",
                data: alumni.toJSON(),
            })

        } catch (error) {
            response.status(500).json({
                status: "FAILED",
                message: error.message,
            })
        }
    }

    async show({params, response}) {

    }

    async store({request, response}) {

    }

    async update({request, response, params}) {

    }

    async delete({params, response}) {

    }
}

module.exports = AlumniController
