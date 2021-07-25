const Route = use("Route");

Route.group(() => {
  Route.resource("activity-category", "ActivityCategoryController").apiOnly();
  Route.resource("activity", "ActivityController").apiOnly();

  /** Note : need to change it into activity questionnaire */
  // Route.resource("activity-form-template", "ActivityFormTemplateController").apiOnly();
}).prefix("v1");