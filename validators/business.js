const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('../common/ValidationError');

const businessFields = [
  'name',
  'image',
  'typeImage',
  'pageNumber',
  'value',
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

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
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
    }, businessFields);
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

    if (!_.isString(payload.name)) {
      throw ValidationError('name', '"payload.name" can only be a string!');
    }

    if (payload.image) {
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
      }, businessFields);
    }

    return _.pick({
      name: payload.name,
    }, businessFields);
  }

  get(params) {
    if (!params.pageNumber) {
      throw ValidationError('pageNumber', '"params.pageNumber" is required!');
    }

    if (!validator.isInt(`${params.pageNumber}`)) {
      throw ValidationError('pageNumber', '"params.pageNumber" can only be an integer!');
    }

    if (params.pageNumber < 0) {
      throw ValidationError('pageNumber', '"params.pageNumber" "params.pageNumber" cannot be less than zero!');
    }

    return _.pick(params, businessFields);
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

    if (params.pageNumber < 0) {
      throw ValidationError('pageNumber', '"params.pageNumber" "params.pageNumber" cannot be less than zero!');
    }

    return _.pick(params, businessFields);
  }
}

module.exports = {
  businessValidate: new BusinessValidate(),
  BusinessValidate,
  businessFields,
}