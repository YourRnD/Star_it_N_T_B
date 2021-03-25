'use strict'

exports.status = (status, values, res) => {
  res.status(status);
  return res.send({
    status,
    ...values
  });
}