'use strict'

const User = use('App/Models/User')
const UsersGroup = use('App/Models/UsersGroup')
const Group = use('App/Models/Group')
const { validateAll } = use('Validator')
const Hash = use('Hash')
const Helpers = use('Helpers')

class UserController {

    async login({ request, response, auth }) {

        const rules = {
            email: 'required|email',
            password: 'required|min:6',
        }

        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', message: validation.messages() })
        }

        const { email, password } = request.all()

        try {
            const user = await User.findBy('email', email)
            const token = await auth.withRefreshToken().attempt(email, password);

            if (!user.active) {
                return response.json({ status: 'FAILED', message: 'the account is inactive' })
            }
            const user_group = await UsersGroup.findBy('user_id', user.id)
            const group = await Group.findBy('id', user_group.group_id)
            user.group = group

            return response.json({ status: 'SUCCESS', message: 'login success', token, user })
        } catch (error) {
            return response.json({
                status: 'FAILED',
                message: error.message
            })
        }

    }

    async index({ response }) {
        const users = await User
            .query()
            .with('users_group.groups')
            .fetch()

        return response.json({ status: 'SUCCESS', message: 'success get users', users })
    }

    async store({ request, response }) {

        const rules = {
            username: 'required|unique:users,username',
            email: 'required|email|unique:users,email',
            password: 'required|min:6',
            first_name: 'required',
            last_name: 'required',
            group_id: 'required'
        }

        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', message: validation.messages() })
        }

        const {
            username,
            email,
            password,
            first_name,
            last_name,
            group_id
        } = request.all()

        const user = await User.create({
            username,
            email,
            password,
            first_name,
            last_name
        })

        const user_group = await UsersGroup.create({
            user_id: user.id,
            group_id
        })
        const group = await Group.findBy('id', user_group.group_id)

        const data = await User.findBy('id', user.id)
        data.group = group

        return response.json({ status: 'SUCCESS', message: 'Register Success', data })
    }

    async show({ params, response }) {
        try {
            const id = params.id
            const user = await User
                .query()
                .where('id', id)
                .with('users_group.groups')
                .fetch()

            if (user.toJSON().length > 0) {
                return response.json({
                    status: 'SUCCESS',
                    message: 'success get user',
                    user
                })
            } else {
                return response.json({
                    status: 'FAILED',
                    message: 'user not found'
                })
            }

        } catch (error) {
            return response.json({
                status: 'FAILED',
                message: error.message
            })
        }
    }

    async update({ request, response, params }) {

        const id = params.id

        const rules = {
            username: `required|unique:users,username,id,${id}`,
            email: `required|email|unique:users,email,id,${id}`,
            first_name: 'required',
            last_name: 'required',
            group_id: 'required',
            active: 'boolean'
        }
        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', message: validation.messages() })
        }

        const {
            username,
            email,
            first_name,
            last_name,
            group_id,
            active
        } = await request.all()

        await User
            .query()
            .where('id', id)
            .update({
                username,
                email,
                first_name,
                last_name,
                active
            })

        await UsersGroup
            .query()
            .where('user_id', id)
            .update({ group_id })

        const user = await User
            .query()
            .where('id', id)
            .with('users_group.groups')
            .fetch()

        return response.json({ status: 'SUCCESS', message: 'Update Success', user })
    }

    async reset_password({ request, params, response }) {
        const id = params.id
        const rules = {
            password: 'required|min:6',
            password_confirmation: 'same:password'
        }

        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', message: validation.messages() })
        }

        const { password } = request.all()

        await User
            .query()
            .where('id', id)
            .update({
                password: await Hash.make(password)
            })

        return response.json({
            status: 'SUCCESS',
            message: 'password reset successfully',
            new_password: password
        })
    }

    async destroy({ params, response }) {
        try {
            const id = params.id
            const user = await User.find(id)
            await user.delete()

            return response.json({ status: 'SUCCESS', message: `delete user with id ${id} success` })
        } catch (error) {
            return response.json({
                status: 'FAILED',
                message: error.message
            })
        }
    }

    async upload({ request, params, response, }) {

        const rules = {
            file_image: `required`
        }
        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', message: validation.messages() })
        }

        const image = request.file('image', {
            types: ['image'],
            size: '2mb',
            extnames: ['png', 'jpg', 'jpeg']
        })

        await image.move(Helpers.tmpPath('uploads'), {
            name: `${new Date().getTime()}-${image.clientName}`,
            overwrite: true
        })

        if (!image.moved()) {
            return response.json({
                status: 'FAILED',
                message: image.error()
            })
        }

        const id = params.id
        try {
            await User
                .query()
                .where('id', id)
                .update({
                    file_image: Helpers.tmpPath(image.fileName)
                })
        } catch (error) {
            return response.json({
                status: 'FAILED',
                message: error.message
            })
        }

        return response.json({
            status: 'SUCCESS',
            message: 'Gambar berhasil di upload'
        })
    }
}

module.exports = UserController
