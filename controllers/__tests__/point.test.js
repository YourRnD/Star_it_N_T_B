const request = require('supertest');
const app = require('../../app');

let token;
let userId;
let id;

//before all the tests

test('Create new user', async () => {
  let res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "testPoint.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  userId = res.body.user.id;

  expect(1).toEqual(1);
});

test('Login new user', async () => {

  let res = await request(app)
    .get('/api/customer/signin?email=testPoint.mail@gmail.com&password=Qwerty_12345');

  token = res.body.token;

  expect(1).toEqual(1);
});

// POST api/point

test('Error! Add new point: no payload object', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Add new point: payload has no "name" property', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" is required!');
});

test('Error! Add new point: payload has no "address" propertypayload has no "address" property', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('address');
  expect(res.body.message).toMatch('"payload.address" is required!');
});

test('Error! Add new point: property "name" can only be a string', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": 1,
        "address": "Address test point"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" can only be a string!');
});

test('Error! Add new point: property "address" can only be a string', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('address');
  expect(res.body.message).toMatch('"payload.address" can only be a string!');
});

test('Success! Add new point', async () => {
  const res = await request(app)
    .post('/api/point')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": "Address test point"
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Point added successfully!');
  expect(res.body).toHaveProperty('point');

  id = res.body.point.id;
});

// GET api/point/:id

test('Error! Get point: id is not exist', async () => {
  const res = await request(app)
    .get(`/api/point/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Point with this id does not exist!');
});

test('Success! Get a point by id', async () => {
  const res = await request(app)
    .get(`/api/point/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('point');
  expect(res.body.message).toMatch('Point find!');
});

// GET api/point/

test('Error! Get all the points: params has no "pageNumber" property', async () => {
  const res = await request(app)
    .get(`/api/point`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" is required!');
});

test('Error! Get all the points: property "pageNumber" can only be an integer', async () => {
  const res = await request(app)
    .get(`/api/point?pageNumber=asd`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" can only be an integer!');
});

test('Error! Get all the point: property "pageNumber" cannot be less than zero', async () => {
  const res = await request(app)
    .get(`/api/point?pageNumber=-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" cannot be less than zero!');
});

test('Error! Get all the point: no records found!', async () => {
  const res = await request(app)
    .get(`/api/point?pageNumber=100000000000000`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('No records found!');
});

test('Success! Get all the points', async () => {
  const res = await request(app)
    .get(`/api/point?pageNumber=0`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('points');
  expect(res.body.message).toMatch('Points find!');
});

// GET api/point/search

test('Error! Search points: params has no "pageNumber" property', async () => {
  const res = await request(app)
    .get(`/api/point/search`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" is required!');
});

test('Error! Search points: params has no "value" property', async () => {
  const res = await request(app)
    .get(`/api/point/search?pageNumber=0`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('value');
  expect(res.body.message).toMatch('"params.value" is required!');
});

test('Error! Search points: property "pageNumber" can only be an integer', async () => {
  const res = await request(app)
    .get(`/api/point/search?pageNumber=asd&value=123`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" can only be an integer!');
});

test('Error! Search points: property "pageNumber" cannot be less than zero', async () => {
  const res = await request(app)
    .get(`/api/point/search?pageNumber=-1&value=Test point`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" cannot be less than zero!');
});

test('Error! Search points: no records found!', async () => {
  const res = await request(app)
    .get(`/api/point/search?pageNumber=100000000000000&value=Test point`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('No records found!');
});

test('Success! Search points', async () => {
  const res = await request(app)
    .get(`/api/point/search?pageNumber=0&value=Test point`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('points');
  expect(res.body.message).toMatch('Points find!');
});

// PUT api/point/:id

test('Error! Update point: no payload object', async () => {
  const res = await request(app)
    .put(`/api/point/${id}`)
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Update point: payload has no "name" property', async () => {
  const res = await request(app)
    .put(`/api/point/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" is required!');
});

test('Error! Update point: payload has no "address" propertypayload has no "address" property', async () => {
  const res = await request(app)
    .put(`/api/point/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('address');
  expect(res.body.message).toMatch('"payload.address" is required!');
});

test('Error! Update point: property "name" can only be a string', async () => {
  const res = await request(app)
    .put(`/api/point/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": 1,
        "address": "Address test point"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" can only be a string!');
});

test('Error! Update point: property "address" can only be a string', async () => {
  const res = await request(app)
    .put(`/api/point/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('address');
  expect(res.body.message).toMatch('"payload.address" can only be a string!');
});

test('Error! Update point: id is not correctly', async () => {
  const res = await request(app)
    .put(`/api/point/err`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": "Address test point"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Update point: id is not correctly', async () => {
  const res = await request(app)
    .put(`/api/point/-1`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": "Address test point"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Point with this id does not exist!');
});

test('Success! Update point', async () => {
  const res = await request(app)
    .put(`/api/point/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test point",
        "address": "Address test point"
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Point updated successfully!');
  expect(res.body).toHaveProperty('point');

  id = res.body.point.id;
});

// DELETE api/point/:id

test('Error! Delete point: id is not correctly', async () => {
  const res = await request(app)
    .delete(`/api/point/err`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Delete point: id is not exist', async () => {
  const res = await request(app)
    .delete(`/api/point/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Point with this id does not exist!');
});

test('Success! Delete point', async () => {
  const res = await request(app)
    .delete(`/api/point/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Point deleted successfully!');
  expect(res.body).toHaveProperty('point');
});

//after all the tests

test('Delete user!', async () => {
  await request(app)
    .delete(`/api/customer/${userId}`)
    .set({ 'Authorization': token });

  expect(1).toEqual(1);
});

