const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('../common/ValidationError');

const authFields = [
  'name',
  'email',
  'password',
  'mac',
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

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!validator.isEmail(payload.email)) {
      throw ValidationError('email', '"payload.email" is not correctly!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isStrongPassword(payload.password)) {
      throw ValidationError('password', '"payload.password" is not correctly!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    return _.pick(payload, authFields);
  }

  refresh(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    return _.pick(payload, authFields);
  }

  me(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    return _.pick(payload, authFields);
  }
}

module.exports = {
  authValidate: new AuthValidate(),
  AuthValidate,
  authFields,
}