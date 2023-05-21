'use strict';

const JWT = require('jsonwebtoken');
const jwtConfig = require('@config/jwt');

module.exports = {
  sign: (user, kind = null) => {
    if (kind == 'refresh') {
      return JWT.sign({ user }, jwtConfig.secret, jwtConfig.accessTokenOptions)
    }
    return JWT.sign({ user }, jwtConfig.secret, jwtConfig.refreshTokenOptions);
  },

  verify: token => {
    try {
      return JWT.verify(token, jwtConfig.secret);
    } catch (err) {
      let message = (err.name === 'JsonWebTokenError')
        ? 'Token is invalid'
        : 'Token has been expired';

      return { error: true, message }
    }
  }
};
