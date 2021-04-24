'use strict'

const Model = use('Model')

class MemberRole extends Model {
    static get createdAtColumn() {
        return null;
    }

    static get updatedAtColumn() {
        return null;
    }
}

module.exports = MemberRole
