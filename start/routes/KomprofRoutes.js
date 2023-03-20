const Route = use("Route");

Route.group(() => {
  Route.get("", "KomprofController.index");
  Route.get("/:id", "KomprofController.show");
  Route.post("", "KomprofController.store");
  Route.put("/:id", "KomprofController.update");
  Route.get("/:id/participants", "MemberKomprofController.index");
})
  .prefix("/v1/komprof")
  .middleware(["auth", "activeUser", "privileges:member"]);
