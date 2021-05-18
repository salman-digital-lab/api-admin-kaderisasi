'use strict'

const Kuisioner = use('App/Models/SaveQuestionnaire')

class SaveQuestionnaireSeeder {
    async run() {

        await Kuisioner.createMany([
            {
                id_registration: 1,
                id_name: "input123",
                answer: "Opera philosophica"
            },
            {
                id_registration: 1,
                id_name: "input124",
                answer: "085623456789"
            },
            {
                id_registration: 1,
                id_name: "input125",
                answer: `["abc", "def"]`
            },
            {
                id_registration: 2,
                id_name: "input123",
                answer: "philosophicaopera"
            },
            {
                id_registration: 2,
                id_name: "input124",
                answer: "085623456789"
            },
            {
                id_registration: 2,
                id_name: "input125",
                answer: `["abc", "def"]`
            },
            {
                id_registration: 3,
                id_name: "input123",
                answer: "Eadem fortitudinis"
            },
            {
                id_registration: 3,
                id_name: "input124",
                answer: "085623456789"
            },
            {
                id_registration: 3,
                id_name: "input125",
                answer: `["abc", "def"]`
            },
            {
                id_registration: 4,
                id_name: "input123",
                answer: "philosophicafortitudinis"
            },
            {
                id_registration: 4,
                id_name: "input124",
                answer: "085623456789"
            },
            {
                id_registration: 4,
                id_name: "input125",
                answer: `["abc", "def"]`
            }
        ])
    }
}

module.exports = SaveQuestionnaireSeeder
