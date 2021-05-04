'use strict'

const Model = use('Model')
const Database = use('Database')

class ActivityRegistration extends Model {

    static registrationStatus() {
        return ['REGISTERED', 'JOINED', 'PASSED', 'FAILED', 'REJECTED'];
    }

    static async getParticipants(whereClause = {}, page, perPage) {

        const selected_fields = [
            'activity_registrations.*',
            'members.name',
            'members.gender',
            'members.email',
            'members.phone',
            'members.faculty',
            'members.major',
            'members.student_id',
            'members.intake_year',
            'members.role_id',
            'member_roles.name as role_name',
            'members.university_id',
            'universities.name as university_name',
        ];

        const activity_registrations = await Database
            .select(selected_fields)
            .from('activity_registrations')
            .where(whereClause)
            .orderBy('activity_registrations.created_at', 'desc')
            .innerJoin('members', 'members.id', 'activity_registrations.member_id')
            .leftJoin('member_roles', 'member_roles.id', 'members.role_id')
            .leftJoin('universities', 'universities.id', 'members.university_id')
            .paginate(page, perPage)

        return activity_registrations
    }

    static get createdAtColumn() {
        return 'created_at'
    }

    static get updatedAtColumn() {
        return null;
    }

    member() {
        return this.hasOne("App/Models/Member", "member_id", "id");
    }
}

module.exports = ActivityRegistration
