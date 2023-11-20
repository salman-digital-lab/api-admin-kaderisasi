const Route = use("Route");

Route.group(() => {
  Route.get("", "AlumniController.index");
  Route.get("/:id", "AlumniController.show");
  Route.post("", "AlumniController.store");
  Route.put("/:id", "AlumniController.update");
  Route.delete("/:id", "AlumniController.delete");
})
  .prefix("/v1/alumni")
  .middleware(["auth", "activeUser", "privileges:members"]);
