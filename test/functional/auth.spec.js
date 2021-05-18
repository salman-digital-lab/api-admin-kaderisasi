'use strict'

const { before, test, trait, after } = use('Test/Suite')('User Login')

trait('DatabaseTransactions')
trait('Test/ApiClient')

const User = use('App/Models/User')

// Data will be used accross test in this suite
before(async () => {
  await User.create({
    email: "123@example.net",
    password: "Example",
    username: "Example Username",
    display_name : "Example User",
    first_name : "Example",
    last_name : "User"
  })
})

after(async () => {
  await User
    .query()
    .where('email', "123@example.net")
    .delete()
})

trait((suite) => {
	suite.Context.macro('getUser', async function() {
		return await User.findByOrFail('email', "123@example.net")
	})	
})

test('test user valid login', async ({ getUser, client }) => {

    const user = getUser()
    const response = await client
        .post('v1/user/login')
        .send({
          email: "123@example.net",
          password: "Example",
        }).end()

    // Assert Response
    response.assertStatus(200)
    response.assertJSONSubset({
        status: "SUCCESS",
        message : "login success",
        data  : [{
          email : "123@example.net",
          name : "Example Name"
        }]
    })
})

test('test user with unknown email', async ({ getUser, client }) => {

    const user = getUser()
    const response = await client
        .post('v1/user/login')
        .send({
          email: "123@examplee.net",
          password: "Example",
        }).end()

    // Assert Response
    response.assertStatus(401)
})

test('test user with wrong password', async ({ getUser, client }) => {

    const user = getUser()
    const response = await client
        .post('v1/user/login')
        .send({
          email: "123@example.net",
          password: "ExamplePassword",
        }).end()

    // Assert Response
    response.assertStatus(401)
})


