const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('./../common/ValidationError');

const feedbackFields = [
  'idPoint',
  'rating',
  'notes',
  'mac',
  'pageNumber',
  'value',
  'base64'
];

class FeedbackValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.mac) {
      throw ValidationError('mac', '"payload.mac" is required!');
    }

    if (!payload.idPoint) {
      throw ValidationError('idPoint', '"payload.idPoint" is required!');
    }

    if (!payload.rating) {
      throw ValidationError('rating', '"payload.rating" is required!');
    }

    if (!payload.notes) {
      throw ValidationError('notes', '"payload.notes" is required!');
    }

    if (!_.isString(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" can only be a string!');
    }

    if (!validator.isMACAddress(payload.mac)) {
      throw ValidationError('mac', '"payload.mac" is not correctly!');
    }

    if (!validator.isInt(`${payload.idPoint}`)) {
      throw ValidationError('idPoint', '"payload.idPoint" can only be an integer!');
    }

    if (!validator.isInt(`${payload.rating}`)) {
      throw ValidationError('rating', '"payload.rating" can only be an integer!');
    }

    if (!_.isString(payload.notes)) {
      throw ValidationError('notes', '"payload.notes" can only be a string!');
    }

    if (!(payload.rating >= 1 && payload.rating <= 5)) {
      throw ValidationError('rating', '"payload.rating" can only take values from 1 to 5 (inclusive)!');
    }

    if (payload.image) {

      if (!_.isArray(payload.image)) {
        throw ValidationError('image', '"payload.image" can only be an array!');
      }

      const base64 = [];

      payload.image.forEach(element => {
        if (!_.isString(element)) {
          throw ValidationError('image', '"payload.image"\'s children can only be a string!');
        }

        const matches = element.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches == null || matches.length !== 3) {
          throw ValidationError('image', '"payload.image"\'s children invalid input string!');
        }

        base64.push({
          base64Img: element,
          typeImage: matches[1],
          image: matches[2]
        });
      });

      return _.pick({
        ...payload,
        base64
      }, feedbackFields);

    }

    return _.pick(payload, feedbackFields);

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

    return _.pick(payload, feedbackFields);
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

    if (payload.idPoint) {

      if (!validator.isInt(`${payload.idPoint}`)) {
        throw ValidationError('idPoint', '"payload.idPoint" can only be an integer!');
      }

      payloadCopy.idPoint = payload.idPoint;

    }

    if (payload.rating) {

      if (!validator.isInt(`${payload.rating}`)) {
        throw ValidationError('rating', '"payload.rating" can only be an integer!');
      }

      if (!(payload.rating >= 1 && payload.rating <= 5)) {
        throw ValidationError('rating', '"payload.rating" can only take values from 1 to 5 (inclusive)!');
      }

      payloadCopy.rating = payload.rating;

    }

    if (payload.image) {

      if (!_.isArray(payload.image)) {
        throw ValidationError('image', '"payload.image" can only be an array!');
      }

      const base64 = [];

      payload.image.forEach(element => {
        if (!_.isString(element)) {
          throw ValidationError('image', '"payload.image"\'s children can only be a string!');
        }

        const matches = element.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches == null || matches.length !== 3) {
          throw ValidationError('image', '"payload.image"\'s children invalid input string!');
        }

        base64.push({
          base64Img: element,
          typeImage: matches[1],
          image: matches[2]
        });
      });

      payloadCopy.base64 = base64;

    }

    if (payload.notes) {

      if (!_.isString(payload.notes)) {
        throw ValidationError('notes', '"payload.notes" can only be a string!');
      }

      payloadCopy.notes = payload.notes;

    }

    return _.pick(payloadCopy, feedbackFields);
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

    return _.pick(payload, feedbackFields);
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

    return _.pick(payload, feedbackFields);
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

    return _.pick(payload, feedbackFields);
  }
}

module.exports = {
  feedbackValidate: new FeedbackValidate(),
  FeedbackValidate,
  feedbackFields,
}