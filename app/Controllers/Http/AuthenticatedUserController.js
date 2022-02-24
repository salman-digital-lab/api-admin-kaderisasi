'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class AuthenticatedUserController {
  async show ({ response, auth }) {
    try {
      const user = await User.getSerializedUser(auth.user.id)

      return response.status(200).json({
        status: 'SUCCESS',
        message: 'user data loaded',
        data: user
      })
    } catch (error) {
      if (error.name === 'DataNotFoundException') {
        return response.status(404).json({
          status: 'FAILED',
          message: 'User not found'
        })
      }
      return response.status(500).json({
        status: 'FAILED',
        message: error.message
      })
    }
  }

  async update ({ request, response, auth }) {
    const rules = {
      first_name: 'required|string',
      last_name: 'required|string',
      username: 'required|string',
      email: 'required|string',
      display_name: 'required|string'
    }

    const data = request.all()

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response.status(400).json({ status: 'FAILED', message: validation.messages()[0].message })
    }

    try {
      const user = await User.findOrFail(auth.user.id)
      user.first_name = data.first_name
      user.last_name = data.last_name
      user.username = data.username
      user.email = data.email
      user.display_name = data.display_name
      await user.save()

      return response.status(200).json({
        status: 'SUCCESS',
        message: 'Data user berhasil diupdate'
      })
    } catch (err) {
      return response.status(500).json({
        status: 'FAILED',
        message: 'Error ketika update ! ' + err.message
      })
    }
  }

  async resetPassword ({ request, response, auth }) {
    const rules = {
      password: 'required|min:6',
      password_confirmation: 'same:password'
    }

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      return response.status(400).json({ status: 'FAILED', message: validation.messages()[0].message })
    }

    const { password } = request.all()

    try {
      const user = await User.findOrFail(auth.user.id)
      user.password = password

      await user.save()

      return response.status(200).json({
        status: 'SUCCESS',
        message: 'password reset successfully'
      })
    } catch (err) {
      return response.status(500).json({
        status: 'FAILED',
        message: err.message
      })
    }
  }
}

module.exports = AuthenticatedUserController
