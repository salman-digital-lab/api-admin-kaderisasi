"use strict";

const { before, test, trait, after } = use("Test/Suite")("User Login");

trait("DatabaseTransactions");
trait("Test/ApiClient");

const User = use("App/Models/User");
const UsersGroup = use("App/Models/UsersGroup");

// Data will be used accross test in this suite
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

test("test user valid login", async ({ getUser, client }) => {
  const user = await getUser();
  const response = await client
    .post("v1/user/login")
    .send({
      email: "123@example.net",
      password: "Example",
    })
    .end();

  // Assert Response
  response.assertStatus(200);
});

test("test user with unknown email", async ({ getUser, client }) => {
  const user = getUser();
  const response = await client
    .post("v1/user/login")
    .send({
      email: "123@examplee.net",
      password: "Example",
    })
    .end();
  // Assert Response
  response.assertStatus(401);
});

test("test user with wrong password", async ({ getUser, client }) => {
  const user = getUser();
  const response = await client
    .post("v1/user/login")
    .send({
      email: "123@example.net",
      password: "ExamplePassword",
    })
    .end();

  // Assert Response
  response.assertStatus(401);
});
