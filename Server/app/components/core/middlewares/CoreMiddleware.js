'use strict';

const JwtToken = require('@utilities/JwtToken');
const UserRepository = require('../repositories/CoreUserRepository')

module.exports = {
  authenticated: (req, res, next) => {
    let error = {
      error: true,
      status: 401,
      message: '401 Unauthorized',
      data: {}
    }

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      let token = req.headers.authorization.split(' ')[1];

      if (!token) return res.status(error.status).json(error);

      let tokenVerified = JwtToken.verify(token);

      if (tokenVerified.error) {
        error.message = tokenVerified.message;
        return res.status(error.status).json(error);
      }

      req.auth = tokenVerified.user;

      return next();
    }
    return res.status(error.status).json(error);
  },

  hasAdminRole: async (req, res, next) => {
    let error = {
      error: true,
      status: 403,
      message: '403 Permission denied',
      data: {}
    };
    let user = await UserRepository.findByIdWithRaw(req.auth.id);

    if (user && user.dataValues.roles[0].role_user.role_id === 1)
      return next();

    return res.status(error.status).json(error);
  }

};
