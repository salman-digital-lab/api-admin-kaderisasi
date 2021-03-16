'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', ({ view }) => {
  return view.render('welcome');
})

Route.group(() => {
  Route.resource('user', 'UserController').apiOnly()
  Route.post('/user/login', 'UserController.login')
  Route.post('/user/:id/reset-password', 'UserController.reset_password')
  Route.post('user/:id/upload', 'UserController.upload')
  Route.resource('group', 'GroupController').apiOnly().middleware('auth')
}).prefix('/v1')

Route.get('tes', ({ auth }) => {
  return auth.getUser()
})
