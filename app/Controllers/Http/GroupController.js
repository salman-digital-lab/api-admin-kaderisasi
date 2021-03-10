'use strict'

const User = use('App/Models/User')
const UsersGroup = use('App/Models/UsersGroup')
const Group = use('App/Models/Group')
const { validateAll } = use('Validator')

class GroupController {

    async index({ response }) {
        try {
            const groups = await Group
                .query()
                .withCount('users_group as number_of_users')
                .fetch()

            return response.json({ status: 'SUCCESS', message: 'success get groups', groups })
        } catch (error) {
            return response.json({
                status: 'FAILED',
                message: error.message
            })
        }

    }

    async store({ request, response }) {

        const rules = {
            name: 'required|unique:groups,name',
            shortname: 'required|unique:groups,shortname',
            description: 'required',
            is_admin: 'required|boolean'
        }

        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', data: validation.messages() })
        }

        const {
            name,
            shortname,
            description,
            is_admin
        } = request.all()

        const group = await Group.create({
            name,
            shortname,
            description,
            is_admin
        })

        const data = await Group.find(group.id)

        return response.json({ status: 'SUCCESS', message: 'successfully added new group', data })
    }

    async update({ request, response, params }) {

        const id = params.id

        const rules = {
            name: `required|unique:groups,name,id,${id}`,
            shortname: `required|unique:groups,shortname,id,${id}`,
            description: 'required',
            is_admin: 'required|boolean'
        }

        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', data: validation.messages() })
        }

        const {
            name,
            shortname,
            description,
            is_admin
        } = request.all()

        await Group
            .query()
            .where('id', id)
            .update({
                name,
                shortname,
                description,
                is_admin
            })

        const group = await Group.find(id)

        return response.json({ status: 'SUCCESS', message: 'Update Success', group })
    }

    async destroy({ params, response }) {
        try {
            const id = params.id
            const group = await Group.find(id)
            await group.delete()

            return response.json({ status: 'SUCCESS', message: `delete group with id ${id} success` })
        } catch (error) {
            return response.json({
                status: 'FAILED',
                message: error.message
            })
        }

    }
}

module.exports = GroupController
