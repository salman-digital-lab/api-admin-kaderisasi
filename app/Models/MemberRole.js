'use strict'

const Model = use('Model')

class MemberRole extends Model {
    static get createdAtColumn() {
        return null;
    }

    static get updatedAtColumn() {
        return null;
    }

    static get hidden() {
        return ['shortname', 'description']
    }
}

module.exports = MemberRole
