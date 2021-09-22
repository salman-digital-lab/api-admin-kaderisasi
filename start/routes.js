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

require('./routes/RegionRoutes')
require('./routes/UniversityRoutes')
require('./routes/Activity/ActivityParticipantRoutes')
require('./routes/MemberRoutes')
require('./routes/Activity/ActivityCarouselRoutes')
require('./routes/StudentCareRoutes')
require('./routes/Activity/ActivityRoutes')
require('./routes/Activity/ActivityQuestionnaireRoutes')

Route.get('/', ({ view }) => {
  return view.render('welcome')
})

/** ACL related APIs */
Route.group(() => {
  Route.get('groups/:id/privileges', 'GroupController.privileges')
  Route.post('groups/:id/privileges/:privilege_id', 'GroupController.addPrivilege')
  Route.delete('groups/:id/privileges/:privilege_id', 'GroupController.deletePrivilege')
  Route.resource('groups', 'GroupController').apiOnly()
  Route.get('privileges', 'GroupController.privileges')
  Route.resource('users', 'UserController').apiOnly()
}).prefix('v1').middleware(['auth', 'activeUser', 'privileges:users'])

/** Auth */
Route.group(() => {
  //Route.post('/user/:id/upload', 'UserController.upload').middleware('auth')
  Route.post('/user/login', 'UserController.login')
  //Route.put('/user/:id/reset-password', 'UserController.reset_password')
}).prefix('v1')

Route.group(() => {
  Route.get('', 'AuthenticatedUserController.show')
}).prefix('v1/user').middleware(['auth', 'activeUser'])

Route.group(() => {
  Route.get('member', 'DashboardAdminController.CountMembers')
  Route.get('autocomplete/:universities?', 'DashboardAdminController.AutocompleteUniversities')
  Route.get('provinces/:id?', 'DashboardAdminController.CountMemberProvinces')
  Route.get('universities', 'DashboardAdminController.CountMembersUniversities')
  Route.get('years', 'DashboardAdminController.CountMembersYears')
  Route.get('gender', 'DashboardAdminController.CountMembersGender')
}).prefix('v1/dashboard/get/all')

Route.group(() => {
  Route.get('get/all', 'PublicInformationController.GetAllInformation')
  Route.get('detail', 'PublicInformationController.Detailformation')
  Route.get('insert', 'PublicInformationController.insert')
  Route.put('update', 'PublicInformationController.update')
  Route.delete('delete', 'PublicInformationController.delete')
}).prefix('v1/publicinformartion')

Route.group(() => {
  Route.get('/section/video/:id_section', 'ClassSectionVideoController.index')
  Route.resource('/section/video', 'ClassSectionVideoController').apiOnly()
  Route.get('/section/:id_class', 'ClassSectionController.index')
  Route.resource('/section', 'ClassSectionController').apiOnly()
  Route.get(':id_class/section', 'ClassSectionController.getByClass')
  Route.resource('/', 'ClassController').apiOnly()
}).prefix('v1/class')

Route.group(() => {
  Route.resource('/', 'ChecklistController').apiOnly()
  Route.post('/tick/:member_id/:checklist_id', 'ChecklistController.tick')
  Route.delete('/untick/:member_id/:checklist_id', 'ChecklistController.untick')
  Route.get('/member/:member_id', 'ChecklistController.member')
}).prefix('v1/checklist').middleware('auth')
