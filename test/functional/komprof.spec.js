"use strict";

const { test, trait, before, after } = use("Test/Suite")("Komprofs");

const Komprof = use("App/Models/Komprof");
const MemberKomprof = use("App/Models/MemberKomprof");
const User = use("App/Models/User");
const Member = use("App/Models/Member");
const UsersGroup = use("App/Models/UsersGroup");

trait("DatabaseTransactions");
trait("Test/ApiClient");
trait("Auth/Client");

// For login
trait((suite) => {
  suite.Context.macro("getUser", async function () {
    return await User.findByOrFail("email", "123@example.net");
  });
});

trait((suite) => {
  suite.Context.macro("getMember", async function () {
    return await Member.query().first();
  });
});

// Also need to have authorizedClient trait so we don't need to call loginVia too often
trait((suite) => {
  suite.Context.macro("getKomprof", async function () {
    return await Komprof.query().first();
  });
});

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

const assertKomprofSubset = (response, data) => {
  response.assertJSONSubset({
    data: {
      program_name: data.program_name,
      program_desc: data.program_desc,
      is_active: data.is_active,
    },
  });
};

test("create komprof test", async ({ getUser, assert, client }) => {
  const user = await getUser();
  const body = {
    program_name: "komprof test",
    program_desc: "komporf desc",
    is_active: 1,
  };
  const response = await client
    .post(`v1/komprof`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(201);
  assertKomprofSubset(response, body);
});

test("get komprof test", async ({ getUser, assert, client }) => {
  const user = await getUser();
  const response = await client.get(`v1/komprof`).loginVia(user).end();

  response.assertStatus(200);
});

test("get detail komprof test", async ({
  getUser,
  getKomprof,
  assert,
  client,
}) => {
  const user = await getUser();
  const komprof = await getKomprof();
  const response = await client
    .get(`v1/komprof/${komprof.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assertKomprofSubset(response, komprof.toJSON());
});

test("update komprof test", async ({ getUser, getKomprof, assert, client }) => {
  const user = await getUser();
  const komprof = await getKomprof();
  const body = {
    program_name: "komprof test updated",
    program_desc: "komporf desc updated",
    is_active: 1,
  };
  const response = await client
    .put(`v1/komprof/${komprof.id}`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assertKomprofSubset(response, body);
});

test("get komprof participants test", async ({
  getUser,
  getKomprof,
  client,
}) => {
  const user = await getUser();
  const komprof = await getKomprof();
  const response = await client
    .get(`v1/komprof/${komprof.id}/participants`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("add komprof participants test", async ({
  getMember,
  getUser,
  getKomprof,
  client,
}) => {
  const member = await getMember();
  const user = await getUser();
  const komprof = await getKomprof();
  const body = {
    komprof_id: komprof.id,
    member_id: member.id,
    batch: 1,
  };
  const response = await client
    .post(`v1/komprof/${komprof.id}/participants`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("delete komprof participants test", async ({
  getMember,
  getUser,
  getKomprof,
  client,
}) => {
  const member = await getMember();
  const user = await getUser();
  const komprof = await getKomprof();

  const body = {
    komprof_id: komprof.id,
    member_id: member.id,
    batch: 1,
  };
  await client
    .post(`v1/komprof/${komprof.id}/participants`)
    .send(body)
    .loginVia(user)
    .end();

  const response = await client
    .delete(`v1/komprof/${komprof.id}/participants/${member.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
});
