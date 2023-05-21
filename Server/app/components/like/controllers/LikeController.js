'use strict';

const LikeService = require('../services/LikeService');

const LoginController = {
  createLike: async (req, res) => {
    let response = await LikeService.createLike(req);

    res.status(response.status).json(response);
  },

  deleteLike: async (req, res) => {
    let response = await LikeService.deleteLike(req);

    res.status(response.status).json(response);
  },
};

module.exports = LoginController;
