const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('./../common/ValidationError');

const pointFields = [
  'address',
  'name',
  'pageNumber',
  'value',
];

class PointValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!payload.address) {
      throw ValidationError('address', '"payload.address" is required!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (!_.isString(payload.address)) {
      throw ValidationError('address', '"payload.address" can only be a string!');
    }

    return _.pick(payload, pointFields);
  }

  delete(_id) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

    return _id;
  }

  update(_id, payload) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!payload.address) {
      throw ValidationError('address', '"payload.address" is required!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (!_.isString(payload.address)) {
      throw ValidationError('address', '"payload.address" can only be a string!');
    }

    return _.pick(payload, pointFields);
  }

  get(params) {
    if (!params.pageNumber) {
      throw ValidationError('pageNumber', '"params.pageNumber" is required!');
    }

    if (!validator.isInt(`${params.pageNumber}`)) {
      throw ValidationError('pageNumber', '"params.pageNumber" can only be an integer!');
    }

    return _.pick(params, pointFields);
  }

  search(params) {
    if (!params.pageNumber) {
      throw ValidationError('pageNumber', '"params.pageNumber" is required!');
    }

    if (!params.value) {
      throw ValidationError('value', '"params.value" is required!');
    }

    if (!validator.isInt(`${params.pageNumber}`)) {
      throw ValidationError('pageNumber', '"params.pageNumber" can only be an integer!');
    }

    return _.pick(params, pointFields);
  }
}

module.exports = {
  pointValidate: new PointValidate(),
  PointValidate,
  pointFields,
}