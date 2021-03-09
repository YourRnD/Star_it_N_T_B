const request = require('supertest');
const app = require('../../app');

let token;
let userId;
let userIdForTestWithAnotherUserId;
let pointId;
let id;
let idFeedbackWithAnotherUserId;

//before all the tests

test('Create new user', async () => {
  let res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "testWithAnotherUserId.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  userIdForTestWithAnotherUserId = res.body.user.id;

  expect(1).toEqual(1);
});

test('Login new user', async () => {

  let res = await request(app)
    .get('/api/customer/signin?email=testWithAnotherUserId.mail@gmail.com&password=Qwerty_12345');

  token = res.body.token;

  expect(1).toEqual(1);
});

test('Added new point', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": "Address test point"
      }
    });

  pointId = res.body.point.id;

  expect(1).toEqual(1);
});

test('Added new feedback', async () => {
  const res = await request(app)
    .post(`/api/feedback`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  idFeedbackWithAnotherUserId = res.body.feedback.id;

  expect(1).toEqual(1);
});

test('Create new user', async () => {
  let res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "testFeedback.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  userId = res.body.user.id;

  expect(1).toEqual(1);
});

test('Login new user', async () => {

  let res = await request(app)
    .get('/api/customer/signin?email=testFeedback.mail@gmail.com&password=Qwerty_12345');

  token = res.body.token;

  expect(1).toEqual(1);
});

// POST api/feedback

test('Error! Add new feedback: no payload object', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Add new feedback: payload has no "idPoint" property', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('idPoint');
  expect(res.body.message).toMatch('"payload.idPoint" is required!');
});

test('Error! Add new feedback: payload has no "rating" propertypayload has no "rating" property', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('rating');
  expect(res.body.message).toMatch('"payload.rating" is required!');
});

test('Error! Add new feedback: payload has no "notes" propertypayload has no "notes" property', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('notes');
  expect(res.body.message).toMatch('"payload.notes" is required!');
});

test('Error! Add new feedback: property "idPoint" can only be an integer', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": 'err',
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('idPoint');
  expect(res.body.message).toMatch('"payload.idPoint" can only be an integer!');
});

test('Error! Add new feedback: property "rating" can only be an integer', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 'err',
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('rating');
  expect(res.body.message).toMatch('"payload.rating" can only be an integer!');
});

test('Error! Add new feedback: property "notes" can only be a string', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('notes');
  expect(res.body.message).toMatch('"payload.notes" can only be a string!');
});

test('Error! Add new feedback: property "rating" can only take on certain values (1, 2, 3, 4, 5)', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 6,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('rating');
  expect(res.body.message).toMatch('"payload.rating" can only take values from 1 to 5 (inclusive)!');
});

test('Error! Add new feedback: idPoint is not exist', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": -1,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('There is no such point in the database!');
});

test('Success! Add new feedback', async () => {
  const res = await request(app)
    .post('/api/feedback')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Review added successfully!');
  expect(res.body).toHaveProperty('feedback');

  id = res.body.feedback.id;
});

// GET api/feedback/:id

test('Error! Get feedback: id is not exist', async () => {
  const res = await request(app)
    .get(`/api/feedback/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Feedback with this id does not exist!');
});

test('Success! Get a feedback by id', async () => {
  const res = await request(app)
    .get(`/api/feedback/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('feedback');
  expect(res.body.message).toMatch('Feedback find!');
});

// GET api/feedback/

test('Success! Get all the feedbacks', async () => {
  const res = await request(app)
    .get(`/api/feedback`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('feedback');
  expect(res.body.message).toMatch('Feedback find!');
});

// PUT api/feedback/:id

test('Error! Update feedback: id is not correctly', async () => {
  const res = await request(app)
    .put(`/api/feedback/err`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Update feedback: no payload object', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Update feedback: payload has no "idPoint" property', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('idPoint');
  expect(res.body.message).toMatch('"payload.idPoint" is required!');
});

test('Error! Update feedback: payload has no "rating" propertypayload has no "rating" property', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('rating');
  expect(res.body.message).toMatch('"payload.rating" is required!');
});

test('Error! Update feedback: payload has no "notes" propertypayload has no "notes" property', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('notes');
  expect(res.body.message).toMatch('"payload.notes" is required!');
});

test('Error! Update feedback: property "idPoint" can only be an integer', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": 'err',
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('idPoint');
  expect(res.body.message).toMatch('"payload.idPoint" can only be an integer!');
});

test('Error! Update feedback: property "rating" can only be an integer', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 'err',
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('rating');
  expect(res.body.message).toMatch('"payload.rating" can only be an integer!');
});

test('Error! Update feedback: property "notes" can only be a string', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('notes');
  expect(res.body.message).toMatch('"payload.notes" can only be a string!');
});

test('Error! Update feedback: property "rating" can only take on certain values (1, 2, 3, 4, 5)', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 6,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('rating');
  expect(res.body.message).toMatch('"payload.rating" can only take values from 1 to 5 (inclusive)!');
});

test('Error! Update feedback: idPoint is not exist', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": "-1",
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('There is no such point in the database!');
});

test('Error! Update feedback: id is not exist', async () => {
  const res = await request(app)
    .put(`/api/feedback/-1`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('There is no such review in the database!');
});

test('Error! Update feedback: idCustomer is not equal user id', async () => {
  const res = await request(app)
    .put(`/api/feedback/${idFeedbackWithAnotherUserId}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('You cannot change reviews of other users!');
});

test('Error! Update feedback: idPoint is not exist', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": "-1",
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('There is no such point in the database!');
});

test('Success! Update feedback', async () => {
  const res = await request(app)
    .put(`/api/feedback/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "idPoint": pointId,
        "rating": 1,
        "notes": 'Test feedback'
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Review successfully updated!');
});

// DELETE api/feedback/:id

test('Error! Delete feedback: id is not correctly', async () => {
  const res = await request(app)
    .delete(`/api/feedback/err`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Delete feedback: id is not exist', async () => {
  const res = await request(app)
    .delete(`/api/feedback/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('There is no such review in the database!');
});

test('Error! Update feedback: idCustomer is not equal user id', async () => {
  const res = await request(app)
    .delete(`/api/feedback/${idFeedbackWithAnotherUserId}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('You cannot delete reviews of other users!');
});

test('Success! Delete feedback', async () => {
  const res = await request(app)
    .delete(`/api/feedback/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Review successfully deleted!');
  expect(res.body).toHaveProperty('feedback');
});

//after all the tests

test('Delete point', async () => {
  await request(app)
    .delete(`/api/point/${pointId}`)
    .set({ 'Authorization': token });

  expect(1).toEqual(1);
});

test('Delete user!', async () => {
  await request(app)
    .delete(`/api/customer/${userId}`)
    .set({ 'Authorization': token });

  expect(1).toEqual(1);
});

test('Login new user', async () => {

  let res = await request(app)
    .get('/api/customer/signin?email=testWithAnotherUserId.mail@gmail.com&password=Qwerty_12345');

  token = res.body.token;

  expect(1).toEqual(1);
});

test('Delete feedback', async () => {
  await request(app)
    .delete(`/api/feedback${idFeedbackWithAnotherUserId}`)
    .set({ 'Authorization': token });

  expect(1).toEqual(1);
});

test('Delete user!', async () => {
  await request(app)
    .delete(`/api/customer/${userIdForTestWithAnotherUserId}`)
    .set({ 'Authorization': token });

  expect(1).toEqual(1);
});


