const Route = use("Route");

Route.group(() => {
  Route.get("", "KomprofController.index");
  Route.get("/:id", "KomprofController.show");
  Route.post("", "KomprofController.store");
  Route.put("/:id", "KomprofController.update");
  Route.get("/:komprof_id/participants", "MemberKomprofController.index");
  Route.post(
    "/:komprof_id/participants/bulk",
    "MemberKomprofController.import"
  );
  Route.post("/:komprof_id/participants", "MemberKomprofController.store");
  Route.delete(
    "/:komprof_id/participants/:member_id",
    "MemberKomprofController.delete"
  );
})
  .prefix("/v1/komprof")
  .middleware(["auth", "activeUser", "privileges:member"]);
