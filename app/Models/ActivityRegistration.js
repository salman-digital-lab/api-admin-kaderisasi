'use strict'

const Model = use('Model')

class ActivityRegistration extends Model {

    static registrationStatus() {
        return ['REGISTERED', 'JOINED', 'PASSED', 'FAILED', 'REJECTED'];
    }

    static get createdAtColumn() {
        return 'created_at'
    }

    static get updatedAtColumn() {
        return null;
    }
}

module.exports = ActivityRegistration
