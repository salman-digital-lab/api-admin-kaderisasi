"use strict";

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
const Route = use("Route");

require('./routes/RegionRoutes')
require('./routes/UniversityRoutes');

Route.group(() => {
  Route.resource("activity-category", "ActivityCategoryController").apiOnly();
  Route.resource("activity", "ActivityController").apiOnly();
  Route.resource("activity-form-template", "ActivityFormTemplateController").apiOnly();
}).prefix("v1");

Route.get('/', ({ view }) => {
  return view.render('welcome');
})

Route.group(() => {
  Route.resource('user', 'UserController').apiOnly()
  Route.post('/user/login', 'UserController.login')
  Route.put('/user/:id/reset-password', 'UserController.reset_password')
  Route.post('user/:id/upload', 'UserController.upload')
  Route.resource('group', 'GroupController').apiOnly().middleware('auth')
}).prefix('/v1')
Route.group(() => {
  Route.get('/:activity_id', 'ActivityRegistrationController.index')
  Route.post('/', 'ActivityRegistrationController.store')
  Route.get('/:member_id/:activity_id', 'ActivityRegistrationController.show')
  Route.delete('/:member_id/:activity_id', 'ActivityRegistrationController.destroy')
}).prefix("v1/activity-registration");

require('./routes/ActivityParticipantRoutes');
