const request = require('supertest');
const app = require('../../app');

let adminToken;
let managerToken;
let customerToken;
const emailManager = 'test.point.manager@gmail.com';
const passwordManager = 'Qwerty_322';
const emailCustomer = 'test.point.customer@gmail.com';
const passwordCustomer = 'Qwerty_322';
const emailAdmin = '28filosof28@gmail.com';
const passwordAdmin = 'Qwerty_322';
let managerId;
let customerId;
let businessId;
let businessManagerId;
let pointId;
let adminId;
const {
  successImageForBusiness
} = require('../../common/constantForTests');

describe('Tests for point controller', () => {


  describe('before all the tests', () => {
    test('Create new manager', async () => {
      let res = await request(app)
        .post('/api/auth/signup')
        .send({
          "payload": {
            "name": "Test user",
            "email": `${emailManager}`,
            "password": `${passwordManager}`
          }
        });

      expect(res.status).toEqual(200);

      managerId = res.body.user.id;
    });

    test('Create new customer', async () => {
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

    test('Login customer', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailCustomer}&password=${passwordCustomer}`);

      expect(res.status).toEqual(200);

      customerToken = res.body.accessToken;
      customerId = res.body.user.id;
    });

    test('Login admin', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailAdmin}&password=${passwordAdmin}`);

      expect(res.status).toEqual(200);

      adminToken = res.body.accessToken;
      adminId = res.body.user.id;
    });

    test('Add new business', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": [successImageForBusiness]
          }
        });

      expect(res.status).toEqual(200);

      businessId = res.body.business.id;
    });

    test("User status change", async () => {

      let res = await request(app)
        .put(`/api/customer/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "status": 3
          }
        });

      expect(res.status).toEqual(200);
    });

    test("Issuing manager's rights to a new user", async () => {

      let res = await request(app)
        .post(`/api/manager`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "idCustomer": managerId,
            "idBusiness": businessId
          }
        });

      expect(res.status).toEqual(200);

      businessManagerId = res.body.manager.idmanager;
    });

    test('Login manager', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailManager}&password=${passwordManager}`);

      managerToken = res.body.accessToken;
      managerId = res.body.user.id;

      expect(res.status).toEqual(200);
    });

  });


  describe('POST api/point', () => {
    test('Error! Add new point: no payload object', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': managerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Add new point: payload has no "name" property', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': managerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" is required!');
    });

    test('Error! Add new point: payload has no "address" property', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': managerToken })
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
        .set({ 'Authorization': managerToken })
        .send({
          "payload": {
            "name": 1,
            "address": "Тестовый адрес точки"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" can only be a string!');
    });

    test('Error! Add new point: property "address" can only be a string', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': managerToken })
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

    test('Error! Add new point: property "businessId" can only be an integer', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': managerToken })
        .send({
          "payload": {
            "name": "Test point",
            "address": "Тестовый адрес точки",
            "businessId": "error"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('businessId');
      expect(res.body.message).toMatch('"payload.businessId" can only be an integer!');
    });

    test('Error! Add new point: not enough rights!', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test point",
            "address": "Тестовый адрес точки"
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Succsess! Add new point: manager', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': managerToken })
        .send({
          "payload": {
            "name": "Test point",
            "address": "Тестовый адрес точки"
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point added successfully!');

      pointId = res.body.point.id;
    });

    test('Success! Delete point', async () => {
      const res = await request(app)
        .delete(`/api/point/${pointId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

    test('Succsess! Add new point: admin', async () => {
      const res = await request(app)
        .post('/api/point')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test point",
            "address": "Тестовый адрес точки",
            "businessId": businessId
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point added successfully!');

      pointId = res.body.point.id;
    });

  });

  describe('GET api/point/:id', () => {
    test('Error! Get point: id is not correctly', async () => {
      const res = await request(app)
        .get(`/api/point/err`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Success! Get a point by id', async () => {
      const res = await request(app)
        .get(`/api/point/${pointId}`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point find!');
    });
  });


  describe('GET api/point/search', () => {
    test('Error! Search pointes: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/point/search`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Search pointes: payload has no "value" property', async () => {
      const res = await request(app)
        .get(`/api/point/search?pageNumber=0`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('value');
      expect(res.body.message).toMatch('"payload.value" is required!');
    });

    test('Error! Search pointes: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/point/search?pageNumber=-1&value=Test user`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Search pointes: no records find!', async () => {
      const res = await request(app)
        .get(`/api/point/search?pageNumber=100000000000000&value=Test user`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Search pointes', async () => {
      const res = await request(app)
        .get(`/api/point/search?pageNumber=0&value=Test point`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('points');
      expect(res.body.message).toMatch('Points find!');
    });
  });


  describe('GET api/point', () => {
    test('Error! Get all pointes: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/point`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Get all pointes: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/point?pageNumber=asd`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Get all pointes: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/point?pageNumber=-1`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Get all pointes: no records find!', async () => {
      const res = await request(app)
        .get(`/api/point?pageNumber=100000000000000`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Get all pointes', async () => {
      const res = await request(app)
        .get(`/api/point?pageNumber=0`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('points');
      expect(res.body.message).toMatch('Points find!');
    });
  });


  describe('PUT api/point/:id', () => {
    test('Error! Update point: id is not correctly', async () => {
      const res = await request(app)
        .put(`/api/point/err`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Update point: no payload object', async () => {
      const res = await request(app)
        .put(`/api/point/${pointId}`)
        .set({ 'Authorization': managerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Update point: property "name" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/point/${pointId}`)
        .set({ 'Authorization': managerToken })
        .send({
          "payload": {
            "name": 1,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" can only be a string!');
    });

    test('Error! Update point: property "address" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/point/${pointId}`)
        .set({ 'Authorization': managerToken })
        .send({
          "payload": {
            "address": 1
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('address');
      expect(res.body.message).toMatch('"payload.address" can only be a string!');
    });

    test('Error! Update point: id does not exist!', async () => {
      const res = await request(app)
        .put(`/api/point/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "address": "Тестовый адрес точки"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Point with this id does not exist!');
    });

    test('Succsess! Update point: only name', async () => {
      const res = await request(app)
        .put(`/api/point/${pointId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test point"
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point updated successfully!');
    });
  });


  describe('PUT api/point/:id Sync request №1', () => {
    test('Succsess! Update point: only address', async () => {
      const res = await request(app)
        .put(`/api/point/${pointId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "address": "Тестовый адрес точки"
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point updated successfully!');
    });
  });

  describe('PUT api/point/:id Sync request №2', () => {
    test('Succsess! Update point: all params', async () => {
      const res = await request(app)
        .put(`/api/point/${pointId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test point",
            "address": "Тестовый адрес точки"
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point updated successfully!');
    });
  });


  describe('DELETE api/point/:id', () => {
    test('Error! Delete point: id is not correctly', async () => {
      const res = await request(app)
        .delete(`/api/point/err`)
        .set({ 'Authorization': managerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Delete point: not enough rights!', async () => {
      const res = await request(app)
        .delete(`/api/point/${pointId}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Delete point: id is not exist', async () => {
      const res = await request(app)
        .delete(`/api/point/-1`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Point with this id does not exist!');
    });

    test('Success! Delete point', async () => {
      const res = await request(app)
        .delete(`/api/point/${pointId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('point');
      expect(res.body.message).toMatch('Point deleted successfully!');
    });
  });

  describe('after all the tests', () => {
    test('Success! Delete right', async () => {
      const res = await request(app)
        .delete(`/api/manager/${businessManagerId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

    test('Success! Delete manager', async () => {
      const res = await request(app)
        .delete(`/api/customer/${managerId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

    test('Success! Delete customer', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

    test('Success! Delete business', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

  });
});

