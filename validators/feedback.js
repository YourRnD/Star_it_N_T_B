const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('./../common/ValidationError');

const feedbackFields = [
  'idPoint',
  'rating',
  'notes'
];

class FeedbackValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
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

    return _.pick(payload, feedbackFields);
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

    if (!payload.idPoint) {
      throw ValidationError('idPoint', '"payload.idPoint" is required!');
    }

    if (!payload.rating) {
      throw ValidationError('rating', '"payload.rating" is required!');
    }

    if (!payload.notes) {
      throw ValidationError('notes', '"payload.notes" is required!');
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

    return _.pick(payload, feedbackFields);
  }
}

module.exports = {
  feedbackValidate: new FeedbackValidate(),
  FeedbackValidate,
  feedbackFields,
}