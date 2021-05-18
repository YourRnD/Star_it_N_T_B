const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (token) => {
  const tokenModified = token.split('Bearer ').join('');
  let userDate = jwt.verify(tokenModified, config.jwt);

  return userDate;
};