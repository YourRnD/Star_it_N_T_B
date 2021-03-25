const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (token, mac) => {
  const tokenModified = token.split('Bearer ').join('');
  let userDate = jwt.verify(tokenModified, config.jwt);

  if (!userDate?.mac || userDate?.mac != mac) {
    return {
      status: 401,
    }
  }

  return userDate;
};