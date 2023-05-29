"use strict";

const { test, trait, before, after } = use("Test/Suite")("Komprofs");

const Komprof = use("App/Models/Komprof");
const MemberKomprof = use("App/Models/MemberKomprof");
const User = use("App/Models/User");
const Member = use("App/Models/Member");
const UsersGroup = use("App/Models/UsersGroup");

const Excel = require("exceljs");

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

  // get all members and save it to excel, only save column email
  const members = await Member.all();
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  worksheet.columns = [{ header: "email", key: "email", width: 32 }];
  members.rows.forEach((member) => {
    worksheet.addRow({
      email: member.email,
    });
  });
  await workbook.xlsx.writeFile("test/excel/sample.xlsx");
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
  assert.equal(response.body.status, "SUCCESS");
  assertKomprofSubset(response, body);
});

test("create komprof test - missing program_name", async ({
  getUser,
  assert,
  client,
}) => {
  const user = await getUser();
  const body = {
    program_desc: "komporf desc",
    is_active: 1,
  };
  const response = await client
    .post(`v1/komprof`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(400);
  assert.equal(response.body.status, "FAILED");
  assert.equal(response.body.message[0].field, "program_name");
});

test("get komprof test", async ({ getUser, assert, client }) => {
  const user = await getUser();
  const response = await client.get(`v1/komprof`).loginVia(user).end();

  response.assertStatus(200);
  assert.equal(response.body.status, "SUCCESS");
  assert.hasAnyKeys(response.body, ["message", "data"]);

  const { data } = response.body;
  assert.hasAnyKeys(data, [
    "total",
    "perPage",
    "currentPage",
    "lastPage",
    "data",
  ]);
  assert.isArray(data.data);

  // Additional assertions on the pagination data
  assert.isNumber(data.total);
  assert.isNumber(data.perPage);
  assert.isNumber(data.page);
  assert.isNumber(data.lastPage);
  assert.isTrue(data.total >= 0);
  assert.isTrue(data.perPage >= 0);
  assert.isTrue(data.page >= 1);
  assert.isTrue(data.lastPage >= 1);
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
  assert.equal(response.body.status, "SUCCESS");
  assert.hasAnyKeys(response.body, ["message", "data"]);
  assertKomprofSubset(response, komprof.toJSON());
});

test("get detail komprof test - Komprof not found", async ({
  getUser,
  assert,
  client,
}) => {
  const invalidKomprofId = 999; // Invalid Komprof ID
  const user = await getUser();
  const response = await client
    .get(`v1/komprof/${invalidKomprofId}`)
    .loginVia(user)
    .end();

  response.assertStatus(404);
  assert.equal(response.body.status, "FAILED");
  assert.hasAnyKeys(response.body, ["message"]);
  assert.equal(response.body.message, "Data Komprof tidak ditemukan");
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
  assert.equal(response.body.status, "SUCCESS");
  assert.hasAnyKeys(response.body, ["message", "data"]);

  assertKomprofSubset(response, body);
});

test("update komprof test - partial update", async ({
  getUser,
  getKomprof,
  assert,
  client,
}) => {
  const user = await getUser();
  const komprof = await getKomprof();
  const body = {
    program_desc: "Updated program description",
  };
  const response = await client
    .put(`v1/komprof/${komprof.id}`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.status, "SUCCESS");
  assert.hasAnyKeys(response.body, ["message", "data"]);

  const { data } = response.body;
  assert.equal(data.program_name, komprof.program_name); // Program name remains unchanged
  assert.equal(data.program_desc, body.program_desc); // Program description updated
  assert.equal(data.is_active, komprof.is_active); // is_active remains unchanged
});

test("update komprof test - Komprof not found", async ({
  getUser,
  assert,
  client,
}) => {
  const user = await getUser();
  const invalidKomprofId = 999; // Invalid Komprof ID

  const body = {
    program_name: "Updated program name",
    program_desc: "Updated program description",
    is_active: 1,
  };

  const response = await client
    .put(`v1/komprof/${invalidKomprofId}`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(404);
  assert.equal(response.body.status, "FAILED");
  assert.hasAnyKeys(response.body, ["message"]);
  assert.equal(response.body.message, "Tidak ada data yang ditemukan");
});

test("get komprof participants test - No participants available", async ({
  getUser,
  getKomprof,
  assert,
  client,
}) => {
  const user = await getUser();
  const komprof = await getKomprof();

  const response = await client
    .get(`v1/komprof/${komprof.id}/participants`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.status, "SUCCESS");
  assert.hasAnyKeys(response.body, ["message", "data"]);
  assert.equal(response.body.message, "Data peserta komprof berhasil dimuat!");
  assert.isObject(response.body.data); // Check if data is an object
  assert.equal(response.body.data.total, 0); // Check the total count of participants
  assert.equal(response.body.data.perPage, 10); // Check the number of participants per page
  assert.equal(response.body.data.page, 1); // Check the current page
  assert.equal(response.body.data.lastPage, 0); // Check the last page
  assert.isArray(response.body.data.data); // Check if the participants data is an array
  assert.lengthOf(response.body.data.data, 0); // Check the length of the participants data array
});

test("add komprof participants test", async ({
  getMember,
  getUser,
  getKomprof,
  assert,
  client,
}) => {
  const member = await getMember();
  const user = await getUser();
  const komprof = await getKomprof();
  const body = {
    email: member.email,
    batch: 1,
  };
  const response = await client
    .post(`v1/komprof/${komprof.id}/participants`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.status, "SUCCESS");
  assert.equal(response.body.message, "Peserta komprof berhasil ditambahkan!");
  assert.hasAnyKeys(response.body, ["data"]);
  assert.isObject(response.body.data);
  assert.hasAnyKeys(response.body.data, ["komprof_id", "member_id", "batch"]);
});

test("add komprof participants with invalid email test", async ({
  getUser,
  getKomprof,
  assert,
  client,
}) => {
  const user = await getUser();
  const komprof = await getKomprof();
  const body = {
    komprof_id: komprof.id,
    email: "invalid_email",
    batch: 1,
  };
  const response = await client
    .post(`v1/komprof/${komprof.id}/participants`)
    .send(body)
    .loginVia(user)
    .end();

  response.assertStatus(400);
  assert.equal(response.body.status, "FAILED");
  assert.equal(response.body.message[0].field, "email");
  assert.equal(response.body.message[0].validation, "email");
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
    email: member.email,
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

test("delete non-existent komprof participant test", async ({
  getUser,
  getKomprof,
  client,
}) => {
  const user = await getUser();
  const komprof = await getKomprof();
  const nonExistentMemberId = 9999; // A non-existent member ID

  const response = await client
    .delete(`v1/komprof/${komprof.id}/participants/${nonExistentMemberId}`)
    .loginVia(user)
    .end();

  response.assertStatus(404);
  response.assertJSONSubset({
    status: "FAILED",
    message: "Anggota tidak ditemukan!",
  });
});

test("import komprof participants test", async ({
  getKomprof,
  getUser,
  assert,
  client,
}) => {
  const komprof = await getKomprof();
  const user = await getUser();
  // Assuming you already have the sample excel file
  const filePath = "test/excel/sample.xlsx";

  const response = await client
    .post(`v1/komprof/${komprof.id}/participants/bulk`)
    .attach("file", filePath)
    .field("batch", 1)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSON({
    status: "SUCCESS",
    message: "Data peserta komprof berhasil diimport!",
  });
});
