'use strict'

const Model = use('Model')

class SaveQuestionnaire extends Model {
    static boot() {
        super.boot()
        this.addTrait('NoTimestamp')
    }
}

module.exports = SaveQuestionnaire
