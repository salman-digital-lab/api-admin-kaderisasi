'use strict'

const { test } = use('Test/Suite')('Activities')

trait('DatabaseTransactions')
trait('Test/ApiClient')

trait((suite) => {
	suite.Context.macro('getAnActivity', async function() {
		return await User.findByOrFail('email', "123@example.net")
	})	
})


test('activities index test', async ({assert}) => {



})


test('create activity test', async ({assert}) => {


	
})


test('get activity detail', async ({assert}) => {


	
})

test('get non-existent activity detail', async ({assert}) => {


	
})

test('get participants', async ({assert}) => {


	
})

test('get participant excel', async ({assert}) => {

	
})