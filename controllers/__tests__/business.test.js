const request = require('supertest');
const app = require('../../app');

let adminToken;
let customerToken;
const mac = 'D0:AA:E5:E1:8E:CE';
const extraMac = '4D:56:DD:21:8B:77';
const emailCustomer = 'test.business@gmail.com';
const passwordCustomer = 'Qwerty_322';
const emailAdmin = '28filosof28@gmail.com';
const passwordAdmin = 'Qwerty_322';
let customerId;
let businessId;
let adminId;
const {
  successImageForBusiness,
  errorImageForBusiness
} = require('../../common/constantForTests');

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


  describe('POST api/business', () => {
    test('Error! Add new business: no payload object', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Add new business: payload has no "name" property', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" is required!');
    });

    test('Error! Add new business: payload has no "image" property', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" is required!');
    });

    test('Error! Add new business: payload has no "mac" property', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": successImageForBusiness
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Add new business: property "name" can only be a string', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": 1,
            "image": successImageForBusiness,
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" can only be a string!');
    });

    test('Error! Add new business: property "mac" can only be a string', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": successImageForBusiness,
            "mac": 123
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" can only be a string!');
    });

    test('Error! Add new business: property "mac" can only be a Mac address string', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": successImageForBusiness,
            "mac": "error"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Add new business: property "image" can only be a string', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": 1,
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" can only be a string!');
    });

    test('Error! Add new business: property "image" invalid input string!', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": "ssss",
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" invalid input string!');
    });

    test('Error! Add new business: another mac address', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": "data:image/svg;base64,ssss",
            "mac": extraMac
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Add new business: not enough rights!', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": "data:image/svg;base64,ssss",
            "mac": mac
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Add new business: invalid file type!', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": "data:image/svg;base64,ssss",
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Invalid file type!');
    });

    test('Error! Add new business: image size exceeded!', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": errorImageForBusiness,
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Image size exceeded!');
    });

    test('Succsess! Add new business', async () => {
      const res = await request(app)
        .post('/api/business')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "name": "Test business",
            "image": successImageForBusiness,
            "mac": mac
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('business');
      expect(res.body.message).toMatch('Business added successfully!');

      businessId = res.body.business.id;
    });
  });


  describe('GET api/business/:id', () => {
    test('Error! Get business: id is not correctly', async () => {
      const res = await request(app)
        .get(`/api/business/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Get business: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Get business: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/business/${businessId}?mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get business: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/business/${businessId}?mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get business: another mac address', async () => {
      const res = await request(app)
        .get(`/api/business/${businessId}?mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Success! Get a business by id', async () => {
      const res = await request(app)
        .get(`/api/business/${businessId}?mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('business');
      expect(res.body.message).toMatch('Business find!');
    });
  });


  describe('GET api/business/search', () => {
    test('Error! Search businesses: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/business/search`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Search businesses: payload has no "value" property', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('value');
      expect(res.body.message).toMatch('"payload.value" is required!');
    });

    test('Error! Search businesses: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=0&value=user`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Search businesses: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=asd&value=user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Search businesses: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=0&value=user&mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Search businesses: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=-1&value=Test user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Search businesses: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=0&value=Test user&mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Search businesses: another mac address', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=0&value=Test user&mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Search businesses: no records find!', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=100000000000000&value=Test user&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Search businesses', async () => {
      const res = await request(app)
        .get(`/api/business/search?pageNumber=0&value=Test business&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('businesses');
      expect(res.body.message).toMatch('Businesses find!');
    });
  });


  describe('GET api/business', () => {
    test('Error! Get all businesses: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/business`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Get all businesses: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Get all businesses: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=asd&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Get all businesses: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=0&mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get all businesses: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=-1&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Get all businesses: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=0&mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get all businesses: another mac address', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=0&mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Get all businesses: no records find!', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=100000000000000&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Get all businesses', async () => {
      const res = await request(app)
        .get(`/api/business?pageNumber=0&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('businesses');
      expect(res.body.message).toMatch('Businesses find!');
    });
  });


  describe('PUT api/business/:id', () => {
    test('Error! Update business: id is not correctly', async () => {
      const res = await request(app)
        .put(`/api/business/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Update business: no payload object', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Update business: payload has no "mac" property', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Update business: property "mac" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
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

    test('Error! Update business: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
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

    test('Error! Update business: property "name" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
            "name": 1,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('name');
      expect(res.body.message).toMatch('"payload.name" can only be a string!');
    });

    test('Error! Update business: property "image" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
            "image": 1
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" can only be a string!');
    });

    test('Error! Update business: property "image" invalid input string!', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
            "image": "ssss"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" invalid input string!');
    });

    test('Error! Update business: another mac address', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${extraMac}`
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Update business: not enough rights!', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Update business: invalid file type!', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "image": "data:image/svg;base64,ssss"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Invalid file type!');
    });

    test('Error! Update business: image size exceeded!', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "image": errorImageForBusiness
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Image size exceeded!');
    });

    test('Error! Update business: id does not exist!', async () => {
      const res = await request(app)
        .put(`/api/business/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "image": successImageForBusiness
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Business with this id does not exist!');
    });

    test('Succsess! Update business: only name', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "name": "Test business"
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('business');
      expect(res.body.message).toMatch('Business updated successfully!');
    });
  });


  describe('PUT api/business/:id Sync request №1', () => {
    test('Succsess! Update business: only image', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "image": successImageForBusiness
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('business');
      expect(res.body.message).toMatch('Business updated successfully!');
    });
  });

  describe('PUT api/business/:id Sync request №2', () => {
    test('Succsess! Update business: all params', async () => {
      const res = await request(app)
        .put(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "name": "Test business",
            "image": successImageForBusiness
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('business');
      expect(res.body.message).toMatch('Business updated successfully!');
    });
  });


  describe('DELETE api/business/:id', () => {
    test('Error! Delete business: id is not correctly', async () => {
      const res = await request(app)
        .delete(`/api/business/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Delete business: no payload object', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Delete business: payload has no "mac" property', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Delete business: property "mac" can only be a string', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
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

    test('Error! Delete business: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
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

    test('Error! Delete business: another mac address', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${extraMac}`
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Delete business: not enough rights!', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Delete business: id is not exist', async () => {
      const res = await request(app)
        .delete(`/api/business/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Business with this id does not exist!');
    });

    test('Success! Delete business', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('business');
      expect(res.body.message).toMatch('Business deleted successfully!');
    });
  });

  describe('after all the tests', () => {
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
    });
  });
});

