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

Route.group(() => {
  Route.resource("activity-category", "ActivityCategoryController").apiOnly();
  Route.resource("activity", "ActivityController").apiOnly();
  Route.resource("activity-form-template", "ActivityFormTemplateController").apiOnly();
}).prefix("v1");

Route.group(() => {
  Route.get('/:activity_id', 'ActivityRegistrationController.index')
  Route.post('/', 'ActivityRegistrationController.store')
  Route.get('/:member_id/:activity_id', 'ActivityRegistrationController.show')
  Route.delete('/:member_id/:activity_id', 'ActivityRegistrationController.destroy')
}).prefix("v1/activity-registration");

require('./routes/ActivityParticipantRoutes');