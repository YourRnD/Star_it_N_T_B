const request = require('supertest');
const app = require('../../app');

let adminToken;
let customerToken;
const mac = 'D0:AA:E5:E1:8E:CE';
const extraMac = '4D:56:DD:21:8B:77';
const emailCustomer = 'test.customer@gmail.com';
const passwordCustomer = 'Qwerty_322';
const emailAdmin = '28filosof28@gmail.com';
const passwordAdmin = 'Qwerty_322';
let customerId;
let adminId;

describe('Tests for business controller', () => {


  describe('before all the tests', () => {
    test('Create new user', async () => {
      let res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test user",
            "email": `${emailCustomer}`,
            "password": `${passwordCustomer}`
          }
        });

      expect(res.status).toEqual(200);
    });

    test('Login new user', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailCustomer}&password=${passwordCustomer}&mac=${mac}`);

      customerToken = res.body.accessToken;
      customerId = res.body.user.id;

      expect(res.status).toEqual(200);
    });

    test('Login admin user', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailAdmin}&password=${passwordAdmin}&mac=${mac}`);

      adminToken = res.body.accessToken;
      adminId = res.body.user.id;

      expect(res.status).toEqual(200);
    });
  });


  describe('GET api/customer/:id', () => {
    test('Error! Get user: id is not correctly', async () => {
      const res = await request(app)
        .get(`/api/customer/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Get user: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Get user: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/customer/${customerId}?mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get user: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/customer/${customerId}?mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get user: another mac address', async () => {
      const res = await request(app)
        .get(`/api/customer/${customerId}?mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Get user: not enough rights!', async () => {
      const res = await request(app)
        .get(`/api/customer/${adminId}?mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Success! Get a user by id', async () => {
      const res = await request(app)
        .get(`/api/customer/${customerId}?mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.message).toMatch('User find!');
    });
  });


  describe('GET api/customer/search', () => {
    test('Error! Search users: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/customer/search`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Search users: payload has no "value" property', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('value');
      expect(res.body.message).toMatch('"payload.value" is required!');
    });

    test('Error! Search users: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0&value=user`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Search users: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=asd&value=user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Search users: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0&value=user&mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Search users: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=-1&value=Test user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Search users: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0&value=Test user&mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Search users: another mac address', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0&value=Test user&mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Search users: another mac address', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0&value=Test user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Search users: no records find!', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=100000000000000&value=Test user&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Search users', async () => {
      const res = await request(app)
        .get(`/api/customer/search?pageNumber=0&value=Test user&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('users');
      expect(res.body.message).toMatch('Users find!');
    });
  });


  describe('GET api/customer', () => {
    test('Error! Get all users: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/customer`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Get all users: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Get all users: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=asd&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Get all users: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=0&mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get all users: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=-1&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Get all users: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=0&mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get all users: another mac address', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=0&mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Get all users: not enough rights!', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=0&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Get all users: no records find!', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=100000000000000&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Get all users', async () => {
      const res = await request(app)
        .get(`/api/customer?pageNumber=0&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('users');
      expect(res.body.message).toMatch('Users find!');
    });
  });


  describe('PUT api/customer/:id', () => {
    test('Error! Update user: id is not correctly', async () => {
      const res = await request(app)
        .put(`/api/customer/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Update user: no payload object', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Update user: payload has no "mac" property', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Update user: property "mac" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": 123
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" can only be a string');
    });

    test('Error! Update user: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": "err"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });


    test('Error! Update user: property "name" can only be a string!', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": 1,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" can only be a string!');
    });

    test('Error! Update user: property "email" is not mail', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "email": "qwerty",
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('email');
      expect(res.body.message).toMatch('"payload.email" is not correctly!');
    });

    test('Error! Update user: password is not complex enough', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "password": "1234567",
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('password');
      expect(res.body.message).toMatch('"payload.password" is not correctly!');
    });

    test('Error! Get all users: another mac address', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test user",
            "mac": `${extraMac}`
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Get all users: not enough rights!', async () => {
      const res = await request(app)
        .put(`/api/customer/${adminId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test user",
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Update user: id is not exist', async () => {
      const res = await request(app)
        .put(`/api/customer/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test user",
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('User with this id does not exist!');
    });

    test('Success! Update user: only name', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test user",
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Update user: only email', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "email": `${emailCustomer}`,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Update user: only password', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "password": `${passwordCustomer}`,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Update user: all params', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test user",
            "email": `${emailCustomer}`,
            "password": `${passwordCustomer}`,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Admin update user: only name', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test user",
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Admin update user: only email', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "email": `${emailCustomer}`,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Admin update user: only password', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "password": `${passwordCustomer}`,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });

    test('Success! Admin update user: all params', async () => {
      const res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test user changed",
            "email": `${emailCustomer}`,
            "password": `${passwordCustomer}`,
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User updated successfully!');
      expect(res.body).toHaveProperty('user');
    });
  });


  describe('DELETE api/customer/:id', () => {
    test('Error! Delete user: id is not correctly', async () => {
      const res = await request(app)
        .delete(`/api/customer/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Delete user: no payload object', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Delete user: payload has no "mac" property', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Delete user: property "mac" can only be a string', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": 123
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" can only be a string');
    });

    test('Error! Delete user: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": "err"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Delete user: another mac address', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${extraMac}`
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Delete user: not enough rights!', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Delete user: id is not exist', async () => {
      const res = await request(app)
        .delete(`/api/customer/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('User with this id does not exist!');
    });

    test('Success! Delete user', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body.message).toMatch('User deleted successfully!');
      expect(res.body).toHaveProperty('user');
    });
  });


});
