"use strict";

const { before, test, trait, after } = use("Test/Suite")("Questionnaire");

trait("DatabaseTransactions");
trait("Test/ApiClient");

const User = use("App/Models/User");
const UsersGroup = use("App/Models/UsersGroup");

before(async () => {
  const user = await User.create({
    email: "123@example.net",
    password: "Example",
    username: "Example Username",
    display_name: "Example User",
    first_name: "Example",
    last_name: "User",
  });
  await UsersGroup.create({
    user_id: user.id,
    group_id: 1,
  });
});

after(async () => {
  await User.query().where("email", "123@example.net").delete();
});

trait((suite) => {
  suite.Context.macro("getUser", async function () {
    return await User.findByOrFail("email", "123@example.net");
  });
});
