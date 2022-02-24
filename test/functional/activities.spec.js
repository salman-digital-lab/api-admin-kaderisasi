'use strict'

const { test, trait, before, after } = use('Test/Suite')('Activities')

const User = use('App/Models/User')
const Activity = use('App/Models/Activity')
const ActivityRegistration = use('App/Models/ActivityRegistration')

trait('DatabaseTransactions')
trait('Test/ApiClient')

// Also need to have authorizedClient trait so we don't need to call loginVia too often
trait((suite) => {
	suite.Context.macro('getAnActivity', async function() {
		return await Activity
            .query()
            .orderByRaw('rand()')
            .first()
	})	
})

// For login
trait((suite) => {
	suite.Context.macro('getUser', async function() {
		return await User.findByOrFail('email', "123@example.net")
	})	
})


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

// Wrap same activity so we won't duplicate assert over test suites
// Note : until we can change the format of return's date, we won't test dates
// as it won't be necessary
function assertResponseIsSameWithActivity(responseObject, sampleActivity) {
    responseObject.assertJSONSubset({
        data : [{
            id : sampleActivity.id,
            name : sampleActivity.name,
            slug: sampleActivity.slug,
            description: sampleActivity.description,
            //begin_date: sampleActivity.begin_date,
            //end_date: sampleActivity.end_date,
            //register_begin_date: sampleActivity.register_begin_date,
            //register_end_date: sampleActivity.register_end_date,
            status: sampleActivity.status,
            minimum_role_id: sampleActivity.minimum_role_id,
            category_id: sampleActivity.category_id,
            //created_at: sampleActivity.created_at,
            form_data: sampleActivity.form_data,
            is_published: sampleActivity.is_published,
            viewer: sampleActivity.viewer,
        }]
    })
}

function assertParticipantResponse(responseObject, sampleRegistration) {
    responseObject.assertJSONSubset({
        data : [{
            id: sampleRegistration.id,
            member_id: sampleRegistration.member_id,
            activity_id: sampleRegistration.activity_id,
            status: sampleRegistration.status,
            created_at: sampleRegistration.created_at
        }]
    })
}



test('activities index test', async ({assert}) => {



})


test('create activity test', async ({assert}) => {


	
})

// Ensure we can get activity detail
test('get activity detail', async ({getUser, getAnActivity, assert, client}) => {

	// Later, when we implement Auth
	const user = await getUser()
	const sampleActivity = await getAnActivity()

    const response = await client
        .get(`v1/activity/${sampleActivity.id}`)
        .end()
        
    response.assertStatus(200)
    assertResponseIsSameWithActivity(response, sampleActivity)
})

test('get non-existent activity detail', async ({assert, client, getUser}) => {
	// Later, when we implement Auth
	const user = await getUser()

	// Get large number (>> seeding-numer)
    const response = await client
        .get(`v1/activity/12222`)
        .end()

    response.assertStatus(400)
    response.assertJSONSubset({
		status: "FAILED",
		message: "Tidak ada data yang ditemukan"
    })
})

test('get deleted activity detail', async ({assert, client, getAnActivity, getUser}) => {
	// Later, when we implement Auth
	const sampleActivity = await getAnActivity()

	sampleActivity.is_deleted = 1
	await sampleActivity.save()

	// Get large number (>> seeding-numer)
    const response = await client
        .get(`v1/activity/${sampleActivity.id}`)
        .end()

    response.assertStatus(400)
    response.assertJSONSubset({
		status: "FAILED",
		message: "Tidak ada data yang ditemukan"
    })

    // restore
    sampleActivity.is_deleted = 0
    await sampleActivity.save()
})

// Test we can update activity
test('update with same event begin and end date', async ({assert, client, getAnActivity, getUser}) => {

})

// Test we can get data of participants with pagination here
test('get activity participants', async({assert, client, getAnActivity, getUser}) => {
    const activity = await getAnActivity();

    const response = await client
        .get(`v1/activity/${activity.id}/participant`)
        .end()

    response.assertStatus(200)
    // add spec for API response here
})

// Test that we won't fetch participants of non-existent activity, use activity larger
// than activity seeding number
test('participants of non-existent activity', async({assert, client, getAnActivity, getUser}) => {
    const activity = await getAnActivity();

    const response = await client
        .get(`v1/525259289289/participant`)
        .end()

    response.assertStatus(404)
})

// Test that we can fetch participant data
// use random participant data
test('get participant data', async({assert, client, getUser}) => {

    const registration = await ActivityRegistration
        .query()
        .orderByRaw('rand()')
        .first()


    // Ideal spec: check API response is same as expected from member + registration

    const response = await client
        .get(`v1/activity/participant/${registration.id}`)
        .end()

    response.assertStatus(200)
    assertParticipantResponse(response, registration)
})

// Test that we can change participation status
// Using random participation data
test('change participation status', async({assert, client, getUser}) => {
    const registration = await ActivityRegistration
        .query()
        .orderByRaw('rand()')
        .first()

    // get a random element
    const availableStatus = ActivityRegistration.registrationStatus()
    const expectedStatus = availableStatus[Math.floor(Math.random() * availableStatus.length)]

    const response = await client
        .put(`v1/activity/participant/${registration.id}/${expectedStatus}`)
        .end()


    // Reflect change in model without saving it
    registration.status = expectedStatus

    response.assertStatus(200)
    assertParticipantResponse(response, registration)
})

// Test that we can not change participation status not inside the defined status list
// Using random participation data
test('test invalid participation status change', async({assert, client, getUser}) => {
    const registration = await ActivityRegistration
        .query()
        .orderByRaw('rand()')
        .first()

    const response = await client
        .put(`v1/activity/participant/${registration.id}/WRONGSTATUS`)
        .end()

    response.assertStatus(400)
})

// Test that we can export data
// We just check for 200 here -> breaking changes
test('test for data export', async({assert, client, getUser, getAnActivity}) => {

    const activity = await getAnActivity()
    const response = await client
        .get(`v1/activity/${activity.id}/participant/export`)
        .end()

    response.assertStatus(200)
})

// Test that we can get statistics for an activity
// For now, we just assert using 200
test('test for participant statistics', async({assert, client, getUser, getAnActivity}) => {

    const activity = await getAnActivity()
    const response = await client
        .get(`v1/activity/${activity.id}/participant/statistics`)
        .end()

    response.assertStatus(200)
    
    // Assert we have the fields, we don't really care about correctness for now
    const expected_keys = ['total_participants', 'total_males', 'total_females', 'REGISTERED', 'JOINED', 'PASSED', 'FAILED', 'REJECTED']
    assert.sameMembers(expected_keys, Object.keys(response.body.data))

})

test('test fetch questionnaire - normal flow', async({assert, client, getUser, getAnActivity}) => {
    const registration = await ActivityRegistration
        .query()
        .orderByRaw('rand()')
        .first()

    const response = await client
        .get(`v1/activity/participant/${registration.id}/questionnaire`)
        .end()

    response.assertStatus(200)

    const target_activity = await Activity.findOrFail(registration.activity_id)
    const form = JSON.parse(target_activity.form_data)

    // Build expected response key and expected key from activity form data
    const response_keys = []
    const form_keys = []

    for(const field of response.body.data) {
        response_keys.push(field.name)
    }

    for (const field of form) {
        form_keys.push(field.name)
    }

    // Strong assertion :
    // We wish to see and to only see the UNIQUE keys from the form
    assert.includeMembers(response_keys, form_keys)
    assert.includeMembers(form_keys, response_keys)
})


// Simulate a case in which a key from questionnaire is missing
// therefore, we fill them with --KOSONG--

// We won't assert the --KOSONG--, rather assert the above condition :
// to see and to only see the UNIQUE keys from the form
test('test fetch questionnaire - missing keys from answer', async({assert, client, getUser, getAnActivity}) => {
    

    const registration = await ActivityRegistration
        .query()
        .orderByRaw('rand()')
        .first()

    const target_activity = await Activity.findOrFail(registration.activity_id)
    var new_form = JSON.parse(target_activity.form_data)

    // Just in case
    var old_form = new_form

    new_form.push({
        name: "unknown-form-sample",
        type: "text",
        placeholder: true,
        required: true
    })

    target_activity.form_data = JSON.stringify(new_form)
    await target_activity.save()

    const response = await client
        .get(`v1/activity/participant/${registration.id}/questionnaire`)
        .end()

    response.assertStatus(200)



    // Build expected response key and expected key from activity form data
    const response_keys = []
    const form_keys = []

    for(const field of response.body.data) {
        response_keys.push(field.name)
    }

    for (const field of new_form) {
        form_keys.push(field.name)
    }

    // Strong assertion :
    // We wish to see and to only see the UNIQUE keys from the form
    assert.includeMembers(response_keys, form_keys)
    assert.includeMembers(form_keys, response_keys)

    // Post-test, we restore the old_form
    target_activity.form_data = JSON.stringify(old_form)
    target_activity.save()
})

