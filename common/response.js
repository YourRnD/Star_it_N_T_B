'use strict'

exports.status = (status, values, res) => {
  res.status(status);
  res.send({
    status,
    ...values
  });
}