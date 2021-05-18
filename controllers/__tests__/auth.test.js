const request = require('supertest');
const app = require('../../app');

let access_token;
let refresh_token;
let adminToken;
const email = 'test.auth@gmail.com';
const password = 'Qwerty_322';
const emailAdmin = '28filosof28@gmail.com';
const passwordAdmin = 'Qwerty_322';
let customerId;

describe('Tests for manager controller', () => {


  describe('before all the tests', () => {
    test('Login admin user', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailAdmin}&password=${passwordAdmin}`);

      adminToken = res.body.accessToken;

      expect(res.status).toEqual(200);
    });
  });


  describe('POST api/auth/signup', () => {
    test('Error! Add new user: no payload object', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Add new user: payload has no "name" property', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" is required!');
    });

    test('Error! Add new user: payload has no "email" propertypayload has no "email" property', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test auth user"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('email');
      expect(res.body.message).toMatch('"payload.email" is required!');
    });

    test('Error! Add new user: payload has no "password" property', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test auth user",
            "email": `${email}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('password');
      expect(res.body.message).toMatch('"payload.password" is required!');
    });

    test('Error! Add new user: property "name" can only be a string', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": 1,
            "email": `${email}`,
            "password": `${password}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" can only be a string!');
    });

    test('Error! Add new user: property "email" is not mail', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test auth user",
            "email": "error",
            "password": `${password}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('email');
      expect(res.body.message).toMatch('"payload.email" is not correctly!');
    });

    test('Error! Add new user: password is not complex enough', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test auth user",
            "email": `${email}`,
            "password": "1234567"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('password');
      expect(res.body.message).toMatch('"payload.password" is not correctly!');
    });

    test('Error! Add new user: mail is already in use!', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test user",
            "email": "28filosof28@gmail.com",
            "password": `${password}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('This mail is already in use!');
    });

    test('Success! Add new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test user",
            "email": `${email}`,
            "password": `${password}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('Registration completed successfully!');
      expect(res.body).toHaveProperty('user');
    });
  });


  describe('GET api/auth/signin', () => {
    test('Error! Login: payload has no "email" property', async () => {
      const res = await request(app)
        .get(`/api/auth/signin`);

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('email');
      expect(res.body.message).toMatch('"payload.email" is required!');
    });

    test('Error! Login: payload has no "password" property', async () => {
      const res = await request(app)
        .get(`/api/auth/signin?email=${email}`);

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('password');
      expect(res.body.message).toMatch('"payload.password" is required!');
    });

    test('Error! Login: property "email" is not mail', async () => {
      const res = await request(app)
        .get(`/api/auth/signin?email=error&password=${password}`);

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('email');
      expect(res.body.message).toMatch('"payload.email" is not correctly!');
    });

    test('Error! Login: password is not complex enough', async () => {
      const res = await request(app)
        .get(`/api/auth/signin?email=${email}&password=1234567`);

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('password');
      expect(res.body.message).toMatch('"payload.password" is not correctly!');
    });

    test('Login failed: email is not correctly', async () => {
      const res = await request(app)
        .get(`/api/auth/signin?email=test.err@gmail.com&password=${password}`);

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Email or password is incorrect!');
    });

    test('Login failed: password is not correctly', async () => {
      const res = await request(app)
        .get(`/api/auth/signin?email=${email}&password=Qwerty_12345err`);

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Email or password is incorrect!');
    });

    test('Success! Login', async () => {
      const res = await request(app)
        .get(`/api/auth/signin?email=${email}&password=${password}`);

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User find!');
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      access_token = res.body.accessToken;
      refresh_token = res.body.refreshToken;

      customerId = res.body.user.id;
    });
  });


  describe('GET api/auth/refresh', () => {
    test('Success! Refresh token', async () => {
      const res = await request(app)
        .get(`/api/auth/refresh`)
        .set({ 'Authorization': refresh_token });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('Token updated!');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      access_token = res.body.accessToken;
      refresh_token = res.body.refreshToken;
    });
  });


  describe('GET api/auth/me', () => {
    test('Success! Check user', async () => {
      const res = await request(app)
        .get(`/api/auth/me`)
        .set({ 'Authorization': access_token });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User find!');
      expect(res.body).toHaveProperty('user');
    });
  });


  describe('after all the tests', () => {
    test('Success! Delete user', async () => {

      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User deleted successfully!');
      expect(res.body).toHaveProperty('user');
    });
  });


});
