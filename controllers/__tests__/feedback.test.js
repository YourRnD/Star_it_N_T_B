const request = require('supertest');
const app = require('../../app');

let adminToken;
let customerToken;
const emailCustomer = 'test.feedback@gmail.com';
const passwordCustomer = 'Qwerty_322';
const emailAdmin = '28filosof28@gmail.com';
const passwordAdmin = 'Qwerty_322';
let customerId;
let businessId;
let feedbackId;
let pointId;
let adminId;
const {
  successImageForBusiness,
  errorImageForBusiness
} = require('../../common/constantForTests');

describe('Tests for feedback controller', () => {


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
        .get(`/api/auth/signin?email=${emailCustomer}&password=${passwordCustomer}`);

      customerToken = res.body.accessToken;
      customerId = res.body.user.id;

      expect(res.status).toEqual(200);
    });

    test('Login admin user', async () => {

      let res = await request(app)
        .get(`/api/auth/signin?email=${emailAdmin}&password=${passwordAdmin}`);

      adminToken = res.body.accessToken;
      adminId = res.body.user.id;

      expect(res.status).toEqual(200);
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

    test('Add new point: admin', async () => {
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

      pointId = res.body.point.id;
    });
  });


  describe('POST api/feedback', () => {
    test('Error! Add new feedback: no payload object', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Add new feedback: payload has no "idPoint" property', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {}
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idPoint');
      expect(res.body.message).toMatch('"payload.idPoint" is required!');
    });

    test('Error! Add new feedback: payload has no "rating" property', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('rating');
      expect(res.body.message).toMatch('"payload.rating" is required!');
    });

    test('Error! Add new feedback: payload has no "notes" property', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('notes');
      expect(res.body.message).toMatch('"payload.notes" is required!');
    });

    test('Error! Add new feedback: property "idPoint" can only be an integer', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": "error",
            "rating": 1,
            "notes": "Плохой отзыв"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idPoint');
      expect(res.body.message).toMatch('"payload.idPoint" can only be an integer!');
    });

    test('Error! Add new feedback: property "rating" can only be an integer', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": "error",
            "notes": "Плохой отзыв"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('rating');
      expect(res.body.message).toMatch('"payload.rating" can only be an integer!');
    });

    test('Error! Add new feedback: property "notes" can only be a string', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": 123
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('notes');
      expect(res.body.message).toMatch('"payload.notes" can only be a string!');
    });

    test('Error! Add new feedback: property "rating" can only take values from 1 to 5 (inclusive)!', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 6,
            "notes": "Плохой отзыв"
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('rating');
      expect(res.body.message).toMatch('"payload.rating" can only take values from 1 to 5 (inclusive)!');
    });

    test('Error! Add new feedback: property "image" can only be a string!', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": "Плохой отзыв",
            "image": 1
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" can only be an array!');
    });

    test('Error! Add new feedback: property "image" can only be a string!', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": "Плохой отзыв",
            "image": [1]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image"\'s children can only be a string!');
    });

    test('Error! Add new feedback: property "image" invalid input string!', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": "Плохой отзыв",
            "image": ["ssss"]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image"\'s children invalid input string!');
    });

    test('Error! Add new feedback: invalid file type!', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": "Плохой отзыв",
            "image": ["data:image/svg;base64,ssss"]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Invalid image file');
    });

    test('Succsess! Add new feedback', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": "Плохой отзыв",
            "image": [successImageForBusiness]
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review added successfully!');

      feedbackId = res.body.feedback.id;
    });
  });


  describe('GET api/feedback/:id', () => {
    test('Error! Get feedback: id is not correctly', async () => {
      const res = await request(app)
        .get(`/api/feedback/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Get feedback: not enough rights!', async () => {
      const res = await request(app)
        .get(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Success! Get a feedback by id', async () => {
      const res = await request(app)
        .get(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Feedback find!');
    });
  });


  describe('GET api/feedback/search', () => {
    test('Error! Search feedbackes: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/feedback/search`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Search feedbackes: payload has no "value" property', async () => {
      const res = await request(app)
        .get(`/api/feedback/search?pageNumber=0`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('value');
      expect(res.body.message).toMatch('"payload.value" is required!');
    });

    test('Error! Search feedbackes: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/feedback/search?pageNumber=asd&value=user`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Search feedbackes: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/feedback/search?pageNumber=-1&value=Test user`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Search feedbackes: no records find!', async () => {
      const res = await request(app)
        .get(`/api/feedback/search?pageNumber=100000000000000&value=Test user`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Search feedbackes', async () => {
      const res = await request(app)
        .get(`/api/feedback/search?pageNumber=0&value=Test point`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Feedback find!');
    });
  });


  describe('GET api/feedback', () => {
    test('Error! Get all feedbackes: payload has no "pageNumber" property', async () => {
      const res = await request(app)
        .get(`/api/feedback`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" is required!');
    });

    test('Error! Get all feedbackes: property "pageNumber" can only be an integer', async () => {
      const res = await request(app)
        .get(`/api/feedback?pageNumber=asd`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" can only be an integer!');
    });

    test('Error! Get all feedbackes: property "pageNumber" cannot be less than zero', async () => {
      const res = await request(app)
        .get(`/api/feedback?pageNumber=-1`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('pageNumber');
      expect(res.body.message).toMatch('"payload.pageNumber" cannot be less than zero!');
    });

    test('Error! Get all feedbackes: no records find!', async () => {
      const res = await request(app)
        .get(`/api/feedback?pageNumber=100000000000000`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('No records find!');
    });

    test('Success! Get all feedbackes', async () => {
      const res = await request(app)
        .get(`/api/feedback?pageNumber=0`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Feedback find!');
    });
  });


  describe('PUT api/feedback/:id', () => {
    test('Error! Update feedback: id is not correctly', async () => {
      const res = await request(app)
        .put(`/api/feedback/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Update feedback: no payload object', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({});

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('payload');
      expect(res.body.message).toMatch('"payload" is required!');
    });

    test('Error! Update feedback: property "notes" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "notes": 1,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('notes');
      expect(res.body.message).toMatch('"payload.notes" can only be a string!');
    });

    test('Error! Update feedback: property "idPoint" can only be an integer', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "idPoint": 'error',
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('idPoint');
      expect(res.body.message).toMatch('"payload.idPoint" can only be an integer!');
    });

    test('Error! Update feedback: property "rating" can only be an integer', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "rating": 'error',
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('rating');
      expect(res.body.message).toMatch('"payload.rating" can only be an integer!');
    });

    test('Error! Update feedback: property "rating" can only take values from 1 to 5 (inclusive)!', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "rating": 6,
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('rating');
      expect(res.body.message).toMatch('"payload.rating" can only take values from 1 to 5 (inclusive)!');
    });

    test('Error! Update feedback: property "image" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "image": 1
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image" can only be an array!');
    });

    test('Error! Update feedback: property "image" can only be a string', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "image": [1]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image"\'s children can only be a string!');
    });

    test('Error! Update feedback: property "image" invalid input string!', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken })
        .send({
          "payload": {
            "image": ["ssss"]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('image');
      expect(res.body.message).toMatch('"payload.image"\'s children invalid input string!');
    });

    test('Error! Update feedback: invalid file type!', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "image": ["data:image/svg;base64,ssss"]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('Invalid image file');
    });

    test('Error! Update feedback: id does not exist!', async () => {
      const res = await request(app)
        .put(`/api/feedback/-1`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "image": [successImageForBusiness]
          }
        });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('There is no such review in the database!');
    });

    test('Succsess! Update feedback: only notes', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "notes": "Bad review"
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review successfully updated!');
    });

    test('Succsess! Update feedback: only rating', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "rating": 1
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review successfully updated!');
    });

    test('Succsess! Update feedback: only idPoint', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "idPoint": pointId
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review successfully updated!');
    });

    test('Succsess! Update feedback: only image', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "image": [successImageForBusiness]
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review successfully updated!');
    });

    test('Succsess! Update feedback: all params', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken })
        .send({
          "payload": {
            "idPoint": pointId,
            "rating": 1,
            "notes": "Bad review",
            "image": [successImageForBusiness]
          }
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review successfully updated!');
    });
  });

  describe('PUT api/feedback/:id Sync request №2', () => {

  });


  describe('DELETE api/feedback/:id', () => {
    test('Error! Delete feedback: id is not correctly', async () => {
      const res = await request(app)
        .delete(`/api/feedback/err`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(400);
      expect(res.body.param).toMatch('id');
      expect(res.body.message).toMatch('"id" can only be an integer!');
    });

    test('Error! Delete feedback: not enough rights!', async () => {
      const res = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': customerToken });

      expect(res.status).toEqual(403);
      expect(res.body.message).toMatch('Not enough rights!');
    });

    test('Error! Delete feedback: id is not exist', async () => {
      const res = await request(app)
        .delete(`/api/feedback/-1`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(400);
      expect(res.body.message).toMatch('There is no such review in the database!');
    });

    test('Success! Delete feedback', async () => {
      const res = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.message).toMatch('Review successfully deleted!');
    });
  });


  describe('after all the tests', () => {

    test('Delete user', async () => {
      const res = await request(app)
        .delete(`/api/customer/${customerId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

    test('Delete point', async () => {
      const res = await request(app)
        .delete(`/api/point/${pointId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });

    test('Delete business', async () => {
      const res = await request(app)
        .delete(`/api/business/${businessId}`)
        .set({ 'Authorization': adminToken });

      expect(res.status).toEqual(200);
    });
  });
});

