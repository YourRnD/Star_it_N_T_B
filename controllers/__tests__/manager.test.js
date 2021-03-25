const request = require('supertest');
const app = require('../../app');

let adminToken;
let customerToken;
const mac = 'D0:AA:E5:E1:8E:CE';
const extraMac = '4D:56:DD:21:8B:77';
const emailCustomer = 'test.manager@gmail.com';
const passwordCustomer = 'Qwerty_322';
const emailAdmin = '28filosof28@gmail.com';
const passwordAdmin = 'Qwerty_322';
let customerId;
let businessId;
let managerId;
let adminId;
const {
  successImageForBusiness
} = require('../../common/constantForTests');

describe('Tests for manager controller', () => {


  describe('before all the tests', () => {
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
        .get(`/api/auth/signin?email=${emailCustomer}&password=${passwordCustomer}&mac=${mac}`);

      expect(res.status).toEqual(200);

      customerToken = res.body.accessToken;
      customerId = res.body.user.id;
    });

    test('Login admin', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailAdmin}&password=${passwordAdmin}&mac=${mac}`);

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
            "image": successImageForBusiness,
            "mac": mac
          }
        });

      expect(res.status).toEqual(200);

      businessId = res.body.business.id;
    });

    test("User status change", async () => {

      let res = await request(app)
        .put(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "status": 3
          }
        });

      expect(res.status).toEqual(200);
    });

  });


  describe('POST api/manager', () => {
    test('Error! Add new manager: no payload object', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Add new manager: payload has no "mac" property', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Add new manager: payload has no "idCustomer" property', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idCustomer');
      expect(res.body.message).toMatch('"payload.idCustomer" is required!');
    });

    test('Error! Add new manager: payload has no "idBusiness" property', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
            "idCustomer": customerId,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idBusiness');
      expect(res.body.message).toMatch('"payload.idBusiness" is required!');
    });

    test('Error! Add new manager: property "idCustomer" can only be an integer', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idCustomer": 'err',
            "idBusiness": businessId,
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idCustomer');
      expect(res.body.message).toMatch('"payload.idCustomer" can only be an integer!');
    });

    test('Error! Add new manager: property "idBusiness" can only be an integer', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idCustomer": customerId,
            "idBusiness": 'err',
            "mac": mac
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idBusiness');
      expect(res.body.message).toMatch('"payload.idBusiness" can only be an integer!');
    });

    test('Error! Add new manager: property "mac" can only be a string', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idCustomer": customerId,
            "idBusiness": businessId,
            "mac": 123
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" can only be a string!');
    });

    test('Error! Add new manager: property "mac" can only be a Mac address string', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idCustomer": customerId,
            "idBusiness": businessId,
            "mac": "error"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Add new manager: another mac address', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idCustomer": customerId,
            "idBusiness": businessId,
            "mac": extraMac
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Add new manager: not enough rights!', async () => {
      const res = await request(app)
        .post('/api/manager')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idCustomer": customerId,
            "idBusiness": businessId,
            "mac": mac
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test("Issuing manager's rights to a new user", async () => {

      let res = await request(app)
        .post(`/api/manager`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "idCustomer": customerId,
            "idBusiness": businessId,
            "mac": mac
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('manager');
      expect(res.body.message).toMatch('Manager added successfully!');

      managerId = res.body.manager.idmanager;
    });
  });


  describe('GET api/manager/:id', () => {
    test('Error! Get manager: id is not correctly', async () => {
      const res = await request(app)
        .get(`/api/manager/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Get manager: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Get manager: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/manager/${managerId}?mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get manager: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/manager/${managerId}?mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get manager: another mac address', async () => {
      const res = await request(app)
        .get(`/api/manager/${managerId}?mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Success! Get a manager by id', async () => {
      const res = await request(app)
        .get(`/api/manager/${managerId}?mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('manager');
      expect(res.body.message).toMatch('Manager find!');
    });
  });


  describe('GET api/manager/search', () => {
    test('Error! Search manageres: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/manager/search`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Search manageres: payload has no "value" property', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('value');
      expect(res.body.message).toMatch('"payload.value" is required!');
    });

    test('Error! Search manageres: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=0&value=user`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Search manageres: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=asd&value=user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Search manageres: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=0&value=user&mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Search manageres: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=-1&value=Test user&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Search manageres: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=0&value=Test user&mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Search manageres: another mac address', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=0&value=Test user&mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Search manageres: no records find!', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=100000000000000&value=Test user&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Search manageres', async () => {
      const res = await request(app)
        .get(`/api/manager/search?pageNumber=0&value=Test user&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('managers');
      expect(res.body.message).toMatch('Managers find!');
    });
  });


  describe('GET api/manager', () => {
    test('Error! Get all manageres: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/manager`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Get all manageres: payload has no "mac" property', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Get all manageres: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=asd&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Get all manageres: property "mac" can only be a string', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=0&mac=1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get all manageres: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=-1&mac=${mac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Get all manageres: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=0&mac=error`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Get all manageres: another mac address', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=0&mac=${extraMac}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Get all manageres: no records find!', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=100000000000000&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Get all manageres', async () => {
      const res = await request(app)
        .get(`/api/manager?pageNumber=0&mac=${mac}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('managers');
      expect(res.body.message).toMatch('Managers find!');
    });
  });

  describe('PUT api/manager/:id', () => {
    test('Error! Update manager: id is not correctly', async () => {
      const res = await request(app)
        .put(`/api/manager/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Update manager: no payload object', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Update manager: payload has no "mac" property', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Update manager: property "mac" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
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

    test('Error! Update manager: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
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

    test('Error! Update manager: property "idCustomer" can only be an integer', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
            "idCustomer": 'error',
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idCustomer');
      expect(res.body.message).toMatch('"payload.idCustomer" can only be an integer!');
    });

    test('Error! Update manager: property "idBusiness" can only be an integer', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": mac,
            "idBusiness": 'error',
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idBusiness');
      expect(res.body.message).toMatch('"payload.idBusiness" can only be an integer!');
    });

    test('Error! Update manager: another mac address', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${extraMac}`
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Update manager: not enough rights!', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Update manager: id does not exist!', async () => {
      const res = await request(app)
        .put(`/api/manager/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Manager with this id does not exist!');
    });

    test('Succsess! Update manager: only idBusiness', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "idBusiness": businessId,
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('manager');
      expect(res.body.message).toMatch('Manager updated successfully!');
    });
  });


  describe('PUT api/manager/:id Sync request №1', () => {
    test('Succsess! Update manager: only idCustomer', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "idCustomer": customerId,
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('manager');
      expect(res.body.message).toMatch('Manager updated successfully!');
    });
  });

  describe('PUT api/manager/:id Sync request №2', () => {
    test('Succsess! Update manager: all params', async () => {
      const res = await request(app)
        .put(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": mac,
            "idCustomer": customerId,
            "idBusiness": businessId,
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('manager');
      expect(res.body.message).toMatch('Manager updated successfully!');
    });
  });


  describe('DELETE api/manager/:id', () => {
    test('Error! Delete manager: id is not correctly', async () => {
      const res = await request(app)
        .delete(`/api/manager/err`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Delete manager: no payload object', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Delete manager: payload has no "mac" property', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is required!');
    });

    test('Error! Delete manager: property "mac" can only be a string', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": 123
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" can only be a string');
    });

    test('Error! Delete manager: property "mac" is not be a mac address', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": "err"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('mac');
      expect(res.body.message).toMatch('"payload.mac" is not correctly!');
    });

    test('Error! Delete manager: another mac address', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${extraMac}`
          }
        });

      expect(res.status).toEqual(401);
      expect(res.body.message).toMatch('Fatal error, please log in again');
    });

    test('Error! Delete manager: not enough rights!', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Delete manager: id is not exist', async () => {
      const res = await request(app)
        .delete(`/api/manager/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Manager with this id does not exist!');
    });

    test('Success! Delete manager', async () => {
      const res = await request(app)
        .delete(`/api/manager/${managerId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "mac": `${mac}`
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('manager');
      expect(res.body.message).toMatch('Manager deleted successfully!');
    });
  });


  describe('after all the tests', () => {
    test('Success! Delete customer', async () => {
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
    });

  });
});

