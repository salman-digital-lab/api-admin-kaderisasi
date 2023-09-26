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
            let alumni = await Alumni.query()
                .select('name', 'email', 'whatsapp_number', 'full_address', 'occupation', 'current_instance', 'bachelor_degree')
                .where(function () {
                    this.where("name", "LIKE", `%${searchQuery}%`)
                        .orWhere("email", "LIKE", `%${searchQuery}%`)
                        .orWhere("full_address", "LIKE", `%${searchQuery}%`)
                        .orWhere("occupation", "LIKE", `%${searchQuery}%`)
                        .orWhere("current_instance", "LIKE", `%${searchQuery}%`)
                        .orWhere("bachelor_degree", "LIKE", `%${searchQuery}%`)
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

        const { id } = params;

        try {

            let alumni = await Alumni.findOrFail(id)

            if (alumni.contributions != null) {
                let contributions = alumni.contributions
                alumni.contributions = JSON.parse(contributions)
            }

            return response.status(200).json({
                status: "SUCCESS",
                message: "Data Alumni berhasil dimuat!",
                data: alumni,
            })

        } catch (error) {

            if (error.name === "ModelNotFoundException") {
                return response.status(404).json({
                    status: "FAILED",
                    message: "Data tidak ditemukan",
                });
            }

            return response.status(500).json({
                status: "FAILED",
                message: error.message,
            })

        }

    }

    async store({request, response}) {

        const rules = {
            name: "required",
            email: "required"
        };
      
        const validation = await validate(request.all(), rules);
    
        if (validation.fails()) {

            return response.status(400).json({
                status: "FAILED",
                message: validation.messages(),
            })
        }
    
        try {

            const data = request.all()

            const checkIfExist = await Alumni.findBy('email', data.email)

            if (checkIfExist != null) {
                return response.status(400).json({
                    status: "FAILED",
                    message: "Email Alumni sudah terdaftar di dalam sistem",
                })
            }

            let alumni = new Alumni();

            Object.keys(data).forEach((column) => {
                alumni.merge({
                [column]: data[column],
                });
            });

            let contributions = data.contributions
            alumni.contributions = JSON.stringify(contributions)

            await alumni.save();
        
            alumni = await Alumni.findOrFail(alumni.id);
        
            return response.status(201).json({
                status: "SUCCESS",
                message: "Data Alumni berhasil dibuat!",
                data: alumni,
            });

        } catch (error) {

            return response.status(500).json({
                status: "FAILED",
                message: error.message,
            });
        }
    }

    async update({request, response, params}) {

        const rules = {
            name: "string",
            email: "string",
            is_donor: "boolean",
            is_subscriber: "boolean",
        };
      
        const validation = await validate(request.all(), rules);
    
        if (validation.fails()) {

            return response.status(400).json({
                status: "FAILED",
                message: validation.messages(),
            })
        }

        const { id } = params;

        try {
            const data = request.all()
            let alumni = await Alumni.findByOrFail("id", id);

            Object.keys(data).forEach((column) => {
                alumni.merge({
                [column]: data[column],
                });
            });

            let contributions = data.contributions
            alumni.contributions = JSON.stringify(contributions)

            await alumni.save();

            alumni = await Alumni.find(id);

            return response.status(200).json({
                status: "SUCCESS",
                message: "Data Alumni berhasil diperbarui!",
                data: alumni,
            });

        } catch (error) {

            if (error.name === "ModelNotFoundException") {
                return response.status(404).json({
                status: "FAILED",
                message: "Data yang ingin diperbarui tidak ditemukan",
                });
            }

            return response.status(500).json({
                status: "FAILED",
                message: error.message,
            });
        }
    }

    async delete({params, response}) {

        const { id } = params

        try {

            const alumni = await Alumni.findOrFail(id)
            await alumni.delete()

            return response.status(200).json({
                status: "SUCCESS",
                message: "Data Alumni berhasil dihapus!",
                data: alumni,
            })

        } catch (error) {
            if (error.name === "ModelNotFoundException") {
                return response.status(404).json({
                status: "FAILED",
                message: "Data yang ingin dihapus tidak ditemukan",
                });
            }

            return response.status(500).json({
                status: "FAILED",
                message: error.message,
            });
        }
    }
}

module.exports = AlumniController
