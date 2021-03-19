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

Route.group(() => {
  Route.get('member', 'DasbordAdminController.CountMembers')
  Route.get('provinces/:id?', 'DasbordAdminController.CountMemberProvinces')
  Route.get('universities', 'DasbordAdminController.CountMembersUniversities')
  Route.get('years', 'DasbordAdminController.CountMembersYears')
  Route.get('gender', 'DasbordAdminController.CountMembersGender')
}).prefix('v1/members/get/all')
