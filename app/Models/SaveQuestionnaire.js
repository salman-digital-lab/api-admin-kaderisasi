'use strict'

const Model = use('Model')

class SaveQuestionnaire extends Model {
    static boot() {
        super.boot()
        this.addTrait('NoTimestamp')
    }

    static get table() {
        return "save_questionnaire"
    }
}

module.exports = SaveQuestionnaire
