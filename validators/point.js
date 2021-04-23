const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('./../common/ValidationError');

const pointFields = [
  'address',
  'name',
  'pageNumber',
  'value',
  'mac',
  'businessId'
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

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (!_.isString(payload.address)) {
      throw ValidationError('address', '"payload.address" can only be a string!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    if (payload.businessId) {

      if (!validator.isInt(`${payload.businessId}`)) {
        throw ValidationError('businessId', '"payload.businessId" can only be an integer!');
      }

    }

    return _.pick(payload, pointFields);
  }

  delete(_id, payload) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

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

    return _.pick(payload, pointFields);
  }

  update(_id, payload) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

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

    if (payload.name) {

      if (!_.isString(payload.name)) {
        throw ValidationError('name', '"payload.name" can only be a string!');
      }

    }

    if (payload.address) {

      if (!_.isString(payload.address)) {
        throw ValidationError('address', '"payload.address" can only be a string!');
      }

    }

    if (payload.businessId) {

      if (!validator.isInt(`${payload.businessId}`)) {
        throw ValidationError('businessId', '"payload.businessId" can only be an integer!');
      }

    }

    return _.pick(payload, pointFields);
  }

  getAll(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.pageNumber) {
      throw ValidationError('pageNumber', '"payload.pageNumber" is required!');
    }

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    return _.pick(payload, pointFields);
  }

  getAllWithBudinessId(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.pageNumber) {
      throw ValidationError('pageNumber', '"payload.pageNumber" is required!');
    }

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!payload.businessId) {
      throw ValidationError('businessId', '"payload.businessId" is required!');
    }

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isInt(`${payload.businessId}`)) {
      throw ValidationError('businessId', '"payload.businessId" can only be an integer!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    return _.pick(payload, pointFields);
  }

  get(_id, payload) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

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

    return _.pick(payload, pointFields);
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

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    return _.pick(payload, pointFields);
  }
}

module.exports = {
  pointValidate: new PointValidate(),
  PointValidate,
  pointFields,
}