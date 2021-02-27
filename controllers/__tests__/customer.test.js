const request = require('supertest');
const app = require('../../app');

let token;
let id;

// POST api/customer/signup

test('Error! Add new user: no payload object', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Add new user: payload has no "name" property', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" is required!');
});

test('Error! Add new user: payload has no "email" propertypayload has no "email" property', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('email');
  expect(res.body.message).toMatch('"payload.email" is required!');
});

test('Error! Add new user: payload has no "password" property', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('password');
  expect(res.body.message).toMatch('"payload.password" is required!');
});

test('Error! Add new user: property "name" can only be a string', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": 1,
        "email": "test.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" can only be a string!');
});

test('Error! Add new user: property "email" is not mail', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "qwerty",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('email');
  expect(res.body.message).toMatch('"payload.email" is not correctly!');
});

test('Error! Add new user: password is not complex enough', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com",
        "password": "1234567"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('password');
  expect(res.body.message).toMatch('"payload.password" is not correctly!');
});

test('Error! Add new user: mail is already in use!', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "postman5@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('This mail is already in use!');
});

test('Success! Add new user', async () => {
  const res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "testCustomer.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('Registration completed successfully!');
  expect(res.body).toHaveProperty('user');

  id = res.body.user.id;
});

// GET api/customer/signin

test('Login failed: email is not correctly', async () => {
  const res = await request(app)
    .get('/api/customer/signin')
    .send({
      "payload": {
        "email": "test.mail123@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Email or password is incorrect!');
});

test('Login failed: password is not correctly', async () => {
  const res = await request(app)
    .get('/api/customer/signin')
    .send({
      "payload": {
        "email": "test.mail@gmail.com",
        "password": "123"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Email or password is incorrect!');
});

test('Success! Login', async () => {
  const res = await request(app)
    .get('/api/customer/signin')
    .send({
      "payload": {
        "email": "testCustomer.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('User found!');
  expect(res.body).toHaveProperty('token');

  token = res.body.token;
});

// GET api/customer/:id

test('Error! Get user: id is not exist', async () => {
  const res = await request(app)
    .get(`/api/customer/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('User with this id does not exist!');
});

test('Success! Get a user by id', async () => {
  const res = await request(app)
    .get(`/api/customer/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('user');
  expect(res.body.message).toMatch('User find!');
});

// GET api/customer/

test('Success! Get all the user', async () => {
  const res = await request(app)
    .get(`/api/customer`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('users');
  expect(res.body.message).toMatch('Users found!');
});

// PUT api/customer/:id

test('Error! Update user: no payload object', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Update user: payload has no "name" property', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" is required!');
});

test('Error! Update user: payload has no "email" propertypayload has no "email" property', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('email');
  expect(res.body.message).toMatch('"payload.email" is required!');
});

test('Error! Update user: payload has no "password" property', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('password');
  expect(res.body.message).toMatch('"payload.password" is required!');
});

test('Error! Update user: property "name" can only be a string', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": 1,
        "email": "test.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" can only be a string!');
});

test('Error! Update user: property "email" is not mail', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user",
        "email": "qwerty",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('email');
  expect(res.body.message).toMatch('"payload.email" is not correctly!');
});

test('Error! Update user: password is not complex enough', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com",
        "password": "1234567"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('password');
  expect(res.body.message).toMatch('"payload.password" is not correctly!');
});

test('Error! Update user: id is not correctly', async () => {
  const res = await request(app)
    .put(`/api/customer/err`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Update user: id is not exist', async () => {
  const res = await request(app)
    .put(`/api/customer/-1`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('User with this id does not exist!');
});

test('Success! Update user', async () => {
  const res = await request(app)
    .put(`/api/customer/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test user",
        "email": "test.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('User updated successfully!');
  expect(res.body).toHaveProperty('user');
});

// DELETE api/customer/:id

test('Error! Delete user: id is not correctly', async () => {
  const res = await request(app)
    .delete(`/api/customer/err`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Delete user: id is not exist', async () => {
  const res = await request(app)
    .delete(`/api/customer/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('User with this id does not exist!');
});

test('Success! Delete user', async () => {
  const res = await request(app)
    .delete(`/api/customer/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body.message).toMatch('User deleted successfully!');
  expect(res.body).toHaveProperty('user');
});



