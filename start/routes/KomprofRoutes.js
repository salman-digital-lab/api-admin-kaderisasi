const Route = use("Route");

Route.group(() => {
  Route.get("", "KomprofController.index");
  Route.post("", "KomprofController.store");
  Route.put("/:id", "KomprofController.update");
})
  .prefix("/v1/komprof")
  .middleware(["auth", "activeUser", "privileges:member"]);
