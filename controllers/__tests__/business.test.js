const request = require('supertest');
const app = require('../../app');

let token;
let userId;
let id;
const {
  successImageForBusiness,
  errorImageForBusiness
} = require('../../common/constantForTests');

//before all the tests

test('Create new user', async () => {
  let res = await request(app)
    .post('/api/customer/signup')
    .send({
      "payload": {
        "name": "Test user",
        "email": "testBusiness.mail@gmail.com",
        "password": "Qwerty_12345"
      }
    });

  userId = res.body.user.id;

  expect(1).toEqual(1);
});

test('Login new user', async () => {

  let res = await request(app)
    .get('/api/customer/signin?email=testBusiness.mail@gmail.com&password=Qwerty_12345');

  token = res.body.token;

  expect(1).toEqual(1);
});

// POST api/business

test('Error! Add new business: no payload object', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Add new business: payload has no "name" property', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
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
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('image');
  expect(res.body.message).toMatch('"payload.image" is required!');
});

test('Error! Add new business: property "name" can only be a string', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": 1,
        "image": successImageForBusiness
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" can only be a string!');
});

test('Error! Add new business: property "image" can only be a string', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('image');
  expect(res.body.message).toMatch('"payload.image" can only be a string!');
});

test('Error! Add new business: property "image" invalid input string!', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": "ssss"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('image');
  expect(res.body.message).toMatch('"payload.image" invalid input string!');
});

test('Error! Add new business: invalid file type!', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": "data:image/svg;base64,ssss"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Invalid file type!');
});

test('Error! Add new business: image size exceeded!', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": errorImageForBusiness
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Image size exceeded!');
});

test('Succsess! Add new business', async () => {
  const res = await request(app)
    .post('/api/business')
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": successImageForBusiness
      }
    });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('business');
  expect(res.body.message).toMatch('Business added successfully!');

  id = res.body.business.id;
});

// GET api/business/:id

test('Error! Get business: id is not exist', async () => {
  const res = await request(app)
    .get(`/api/business/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Business with this id does not exist!');
});

test('Success! Get a business by id', async () => {
  const res = await request(app)
    .get(`/api/business/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('business');
  expect(res.body.message).toMatch('Business find!');
});

// GET api/business/

test('Error! Get all the businesss: params has no "pageNumber" property', async () => {
  const res = await request(app)
    .get(`/api/business`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" is required!');
});

test('Error! Get all the businesss: property "pageNumber" can only be an integer', async () => {
  const res = await request(app)
    .get(`/api/business?pageNumber=asd`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" can only be an integer!');
});

test('Error! Get all the businesss: property "pageNumber" cannot be less than zero', async () => {
  const res = await request(app)
    .get(`/api/business?pageNumber=-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" cannot be less than zero!');
});

test('Error! Get all the businesss: no records found!', async () => {
  const res = await request(app)
    .get(`/api/business?pageNumber=100000000000000`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('No records found!');
});

test('Success! Get all the businesss', async () => {
  const res = await request(app)
    .get(`/api/business?pageNumber=0`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('businesses');
  expect(res.body.message).toMatch('Businesses find!');
});

// GET api/business/search

test('Error! Search businesss: params has no "pageNumber" property', async () => {
  const res = await request(app)
    .get(`/api/business/search`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" is required!');
});

test('Error! Search businesss: params has no "value" property', async () => {
  const res = await request(app)
    .get(`/api/business/search?pageNumber=0`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('value');
  expect(res.body.message).toMatch('"params.value" is required!');
});

test('Error! Search businesss: property "pageNumber" can only be an integer', async () => {
  const res = await request(app)
    .get(`/api/business/search?pageNumber=asd&value=123`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" can only be an integer!');
});

test('Error! Search businesss: property "pageNumber" cannot be less than zero', async () => {
  const res = await request(app)
    .get(`/api/business/search?pageNumber=-1&value=123`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('pageNumber');
  expect(res.body.message).toMatch('"params.pageNumber" cannot be less than zero!');
});

test('Error! Get all the businesss: no records found!', async () => {
  const res = await request(app)
    .get(`/api/business/search?pageNumber=100000000000000&value=Test business`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('No records found!');
});

test('Success! Search businesss', async () => {
  const res = await request(app)
    .get(`/api/business/search?pageNumber=0&value=Test business`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('businesses');
  expect(res.body.message).toMatch('Businesses find!');
});

// PUT api/business/:id

test('Error! Update business: "id" can only be an integer!', async () => {
  const res = await request(app)
    .put(`/api/business/asd`)
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Update business: no payload object', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({});

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('payload');
  expect(res.body.message).toMatch('"payload" is required!');
});

test('Error! Update business: payload has no "name" property', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {}
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" is required!');
});

test('Error! Update business: property "name" can only be a string', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": 1,
        "image": successImageForBusiness
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('name');
  expect(res.body.message).toMatch('"payload.name" can only be a string!');
});

test('Error! Update business: property "image" can only be a string', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": 1
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('image');
  expect(res.body.message).toMatch('"payload.image" can only be a string!');
});

test('Error! Update business: property "image" invalid input string!', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": "ssss"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('image');
  expect(res.body.message).toMatch('"payload.image" invalid input string!');
});

test('Error! Update business: invalid file type!', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": "data:image/svg;base64,ssss"
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Invalid file type!');
});

test('Error! Update business: image size exceeded!', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": errorImageForBusiness
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Image size exceeded!');
});

test('Error! Update business: id does not exist!', async () => {
  const res = await request(app)
    .put(`/api/business/-1`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": successImageForBusiness
      }
    });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Business with this id does not exist!');
});

test('Succsess! Update business', async () => {
  const res = await request(app)
    .put(`/api/business/${id}`)
    .set({ 'Authorization': token })
    .send({
      "payload": {
        "name": "Test business",
        "image": successImageForBusiness
      }
    });

  console.log(res.body);

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('business');
  expect(res.body.message).toMatch('Business updated successfully!');
});

// DELETE api/business/:id

test('Error! Delete business: id is not correctly', async () => {
  const res = await request(app)
    .delete(`/api/business/err`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.param).toMatch('id');
  expect(res.body.message).toMatch('"id" can only be an integer!');
});

test('Error! Delete business: id is not exist', async () => {
  const res = await request(app)
    .delete(`/api/business/-1`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(400);
  expect(res.body.message).toMatch('Business with this id does not exist!');
});

test('Success! Delete business', async () => {
  const res = await request(app)
    .delete(`/api/business/${id}`)
    .set({ 'Authorization': token });

  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('business');
  expect(res.body.message).toMatch('Business deleted successfully!');
});

//after all the tests

test('Delete user!', async () => {
  await request(app)
    .delete(`/api/customer/${userId}`)
    .set({ 'Authorization': token });

  expect(1).toEqual(1);
});

