const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('../common/ValidationError');

const customerFields = [
  'name',
  'email',
  'password',
];

class CustomerValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!payload.email) {
      throw ValidationError('email', '"payload.email" is required!');
    }

    if (!payload.password) {
      throw ValidationError('password', '"payload.password" is required!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (!validator.isEmail(payload.email)) {
      throw ValidationError('email', '"payload.email" is not correctly!');
    }

    if (!validator.isStrongPassword(payload.password)) {
      throw ValidationError('password', '"payload.password" is not correctly!');
    }

    return _.pick(payload, customerFields);
  }

  delete(_id) {
    if (!_.isInteger(_id)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

    return _id;
  }

  update(_id, payload) {
    if (!_.isInteger(_id)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!payload.email) {
      throw ValidationError('email', '"payload.email" is required!');
    }

    if (!payload.password) {
      throw ValidationError('password', '"payload.password" is required!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (!validator.isEmail(payload.email)) {
      throw ValidationError('email', '"payload.email" is not correctly!');
    }

    if (!validator.isStrongPassword(payload.password)) {
      throw ValidationError('password', '"payload.password" is not correctly!');
    }

    return _.pick(payload, customerFields);
  }
}

module.exports = {
  customerValidate: new CustomerValidate(),
  CustomerValidate,
  customerFields,
}