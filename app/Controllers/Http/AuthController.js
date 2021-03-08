'use strict'

const User = use('App/Models/User')
const UsersGroup = use('App/Models/UsersGroup')
const Group = use('App/Models/Group')
const { validateAll } = use('Validator')

class AuthController {
    async register({ request, response }) {

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
            return response.json({ status: 'FAILED', data: validation.messages() })
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

    async login({ request, response, auth }) {

        const rules = {
            email: 'required|email',
            password: 'required|min:6',
        }

        const validation = await validateAll(request.all(), rules)
        if (validation.fails()) {
            return response.json({ status: 'FAILED', data: validation.messages() })
        }

        const { email, password } = request.all()
        const user = await User.findBy('email', email)
        if (!user.active) {
            return response.json({ status: 'FAILED', message: 'the account is inactive' })
        }

        const token = await auth.attempt(email, password);

        const user_group = await UsersGroup.findBy('user_id', user.id)
        const group = await Group.findBy('id', user_group.group_id)
        user.group = group

        return response.json({ status: 'SUCCESS', message: 'login success', token, user })
    }
}

module.exports = AuthController
