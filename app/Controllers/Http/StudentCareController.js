'use strict'
const Database = use('Database')
var d = Date(Date.now())
const date = d.toString()  
class StudentCareController {

    async delete ({params, response}) {
        const data = params.id
        const hapusData = await Database
        .table('student_care')
        .where('id', data)
        .delete()
        if(hapusData){
             return response.status(200).json({
                    status: "SUCCESS",
                    message: `Data dengan id ${data} BERHASIL dihapus`
                })  
        }
        else{
            return response.status(404).json({
                    status: "FAILED",
                    message: `Data dengan id ${data} GAGAL dihapus`
                }) 
        }  
    }
    async get({response}) {
          try {
            const studentCare = await Database
                                .table('student_care')
            return response.status(200).json({
                status: "SUCCESS",
                message: "Data student care BERHASIL diperoleh",
                data: studentCare
            })

        } catch (err) {
            return response.status(404).json({
                status: "FAILED",
                message: "Data student care GAGAL diperoleh"
            })
        }
    }

    async getById({params, response}) {
        const data = params.id
        const studentCare = await Database
                                .table('student_care')
                                .where('id', data)                    
        try {
            if (studentCare.length > 0) {
                return response.status(200).json({
                status: "SUCCESS",
                message: `Data student care dengan id ${data} BERHASIL diperoleh`,
                data: studentCare
            })
            }
            else{
                return response.status(404).json({
                status: "FAILED",
                message: `Data student care dengan id ${data} tidak ditemukan`,
            })
            }
            

        } catch (err) {
            return response.status(404).json({
                status: "FAILED",
                message: `Data student care dengan id ${data} GAGAL diperoleh`
            })
        }
    }

     async update ({request,response,params}) {
        const data = params.id

        const updateData = await Database
        .table('student_care')
        .where('id', data)
        .update({
            self_data_is_right: request.input('self_data_is_right'), 
            problem_owner: request.input('problem_owner'),  
            problem_owner_name: request.input('problem_owner_name'), 
            problem_category: request.input('problem_category'),
            problem_category_desk: request.input('problem_category_desk'),
            technical_handling: request.input('technical_handling'),
            counselor_gender: request.input('counselor_gender'),
            id_counselor: request.input('id_counselor'),
            status_handling: request.input('status_handling'),
            desk_handling: request.input('desk_handling'),
            updated_at: new Date(),
        })
        
        if(updateData){
            return response.status(200).json({
                    status: "SUCCESS",
                    message: `Data BERHASIL diperbarui` })    
        }
        else{
            return response.status(404).json({
                    status: "FAILED",
                    message: `Maaf data GAGAL diperbarui`
                })        
        }  
    }


}

module.exports = StudentCareController
