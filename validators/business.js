const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('../common/ValidationError');

const businessFields = [
  'name',
  'image',
  'typeImage',
  'pageNumber',
  'value',
  'mac',
  'base64'
];

class BusinessValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.name) {
      throw ValidationError('name', '"payload.name" is required!');
    }

    if (!payload.image) {
      throw ValidationError('image', '"payload.image" is required!');
    }

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    if (!_.isString(payload.image)) {
      throw ValidationError('image', '"payload.image" can only be a string!');
    }

    const matches = payload.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (matches == null || matches.length !== 3) {
      throw ValidationError('image', '"payload.image" invalid input string!');
    }

    return _.pick({
      name: payload.name,
      typeImage: matches[1],
      image: matches[2],
      base64: payload.image,
      mac: payload.mac,
    }, businessFields);
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

    return _.pick(payload, businessFields);
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

    let payloadCopy = {
      mac: payload.mac,
    }

    if (payload.name) {

      if (!_.isString(payload.name)) {
        throw ValidationError('name', '"payload.name" can only be a string!');
      }

      payloadCopy.name = payload.name;

    }

    if (payload.image) {

      if (!_.isString(payload.image)) {
        throw ValidationError('image', '"payload.image" can only be a string!');
      }

      const matches = payload.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches == null || matches.length !== 3) {
        throw ValidationError('image', '"payload.image" invalid input string!');
      }

      payloadCopy.typeImage = matches[1];
      payloadCopy.image = matches[2];
      payloadCopy.base64 = payload.image;

    }

    return _.pick(payloadCopy, businessFields);
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

    return _.pick(payload, businessFields);
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

    return _.pick(payload, businessFields);
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

    return _.pick(payload, businessFields);
  }
}

module.exports = {
  businessValidate: new BusinessValidate(),
  BusinessValidate,
  businessFields,
}