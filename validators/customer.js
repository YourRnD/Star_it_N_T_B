const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('../common/ValidationError');

const customerFields = [
  'name',
  'email',
  'password',
  'value',
  'pageNumber',
  'status'
];

class CustomerValidate {
  get(_id) {

    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

  }

  getAll(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.pageNumber) {
      throw ValidationError('pageNumber', '"payload.pageNumber" is required!');
    }

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    return _.pick(payload, customerFields);
  }

  search(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.pageNumber) {
      throw ValidationError('pageNumber', '"payload.pageNumber" is required!');
    }

    if (!payload.value) {
      throw ValidationError('value', '"payload.value" is required!');
    }

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    return _.pick(payload, customerFields);
  }

  delete(_id) {

    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

  }

  update(_id, payload) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (payload.name) {

      if (!_.isString(payload.name)) {
        throw ValidationError('name', '"payload.name" can only be a string!');
      }

    }

    if (payload.email) {

      if (!validator.isEmail(payload.email)) {
        throw ValidationError('email', '"payload.email" is not correctly!');
      }

    }

    if (payload.password) {

      if (!validator.isStrongPassword(payload.password)) {
        throw ValidationError('password', '"payload.password" is not correctly!');
      }

    }

    if (payload.status) {

      if (!validator.isInt(`${payload.status}`)) {
        throw ValidationError('status', '"payload.status" can only be an integer!');
      }

    }

    return _.pick(payload, customerFields);
  }
}

module.exports = {
  customerValidate: new CustomerValidate(),
  CustomerValidate,
  customerFields,
}