'use strict'

const User = use('App/Models/User')
const UsersGroup = use('App/Models/UsersGroup')
const Group = use('App/Models/Group')
const { validateAll } = use('Validator')
const Hash = use('Hash')
const Helpers = use('Helpers')

class AuthenticatedUserController {
    async show({response, auth }) {
        try {
            const user = await User.getSerializedUser(auth.user.id)
   
            console.log(user)

            return response.json({
                status: 'SUCCESS',
                message: 'user data loaded',
                data : user
            })

        } catch (error) {
            if (error.name == "DataNotFoundException"){
                return response.status(404).json({
                    status: 'FAILED',
                    message: "User not found"
                })
            }
            return response.status(500).json({
                status: 'FAILED',
                message: error.message
            })
        }
    }
}

module.exports = AuthenticatedUserController
