const Route = use("Route");

Route.group(() => {
  Route.resource("activity-category", "ActivityCategoryController").apiOnly();
  Route.resource("activity", "ActivityController").apiOnly();
}).prefix("v1");