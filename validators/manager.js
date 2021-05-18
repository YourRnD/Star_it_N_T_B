const validator = require('validator');
const _ = require('lodash');
const ValidationError = require('./../common/ValidationError');

const managerFields = [
  'idBusiness',
  'idCustomer',
  'pageNumber',
  'value',
];

class ManagerValidate {
  add(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.idCustomer) {
      throw ValidationError('idCustomer', '"payload.idCustomer" is required!');
    }

    if (!payload.idBusiness) {
      throw ValidationError('idBusiness', '"payload.idBusiness" is required!');
    }

    if (!validator.isInt(`${payload.idCustomer}`)) {
      throw ValidationError('idCustomer', '"payload.idCustomer" can only be an integer!');
    }

    if (!validator.isInt(`${payload.idBusiness}`)) {
      throw ValidationError('idBusiness', '"payload.idBusiness" can only be an integer!');
    }

    return _.pick(payload, managerFields);
  }

  delete(_id) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }
  }

  update(_id, payload) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }

    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (payload.idBusiness) {

      if (!validator.isInt(`${payload.idBusiness}`)) {
        throw ValidationError('idBusiness', '"payload.idBusiness" can only be an integer!');
      }

    }

    if (payload.idCustomer) {

      if (!validator.isInt(`${payload.idCustomer}`)) {
        throw ValidationError('idCustomer', '"payload.idCustomer" can only be an integer!');
      }

    }

    return _.pick(payload, managerFields);
  }

  getAll(payload) {
    if (!payload) {
      throw ValidationError('payload', '"payload" is required!');
    }

    if (!payload.pageNumber) {
      throw ValidationError('pageNumber', '"payload.pageNumber" is required!');
    }

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    return _.pick(payload, managerFields);
  }

  get(_id) {
    if (!validator.isInt(`${_id}`)) {
      throw ValidationError('id', '"id" can only be an integer!');
    }
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

    if (!validator.isInt(`${payload.pageNumber}`)) {
      throw ValidationError('pageNumber', '"payload.pageNumber" can only be an integer!');
    }

    if (payload.pageNumber < 0) {
      throw ValidationError('pageNumber', '"payload.pageNumber" cannot be less than zero!');
    }

    return _.pick(payload, managerFields);
  }
}

module.exports = {
  managerValidate: new ManagerValidate(),
  ManagerValidate,
  managerFields,
}