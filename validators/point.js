const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('./../common/ValidationError');

const pointFields = [
  'address',
  'name',
];

class PointValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.address) {
      throw ValidationError('address', '"payload.address" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!_.isString(payload.address)) {
      throw ValidationError('address', '"payload.address" can only be a string!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    return _.pick(payload, pointFields);
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

    if (!payload.address) {
      throw ValidationError('address', '"payload.address" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!_.isString(payload.address)) {
      throw ValidationError('address', '"payload.address" can only be a string!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    return _.pick(payload, pointFields);
  }
}

module.exports = {
  pointValidate: new PointValidate(),
  PointValidate,
  pointFields,
}