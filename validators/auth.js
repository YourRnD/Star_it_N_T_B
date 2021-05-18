const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('../common/ValidationError');

const authFields = [
  'name',
  'email',
  'password',
];

class AuthValidate {
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

    return _.pick(payload, authFields);
  }

  get(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.email) {
      throw ValidationError('email', '"payload.email" is required!');
    }

    if (!payload.password) {
      throw ValidationError('password', '"payload.password" is required!');
    }

    if (!validator.isEmail(payload.email)) {
      throw ValidationError('email', '"payload.email" is not correctly!');
    }

    if (!validator.isStrongPassword(payload.password)) {
      throw ValidationError('password', '"payload.password" is not correctly!');
    }

    return _.pick(payload, authFields);
  }

  refresh(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    return _.pick(payload, authFields);
  }
}

module.exports = {
  authValidate: new AuthValidate(),
  AuthValidate,
  authFields,
}