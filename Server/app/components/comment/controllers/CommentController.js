'use strict';

const CommentService = require('../services/CommentService');

const LoginController = {
  getAll: async (req, res) => {
    let response = await CommentService.getAll(req);

    res.status(response.status).json(response);
  },

  getFirstComment: async (req, res) => {
    let response = await CommentService.getFirstComment(req);

    res.status(response.status).json(response);
  },

  createComment: async (req, res) => {
    let response = await CommentService.createComment(req);

    res.status(response.status).json(response);
  },

  updateComment: async (req, res) => {
    let response = await CommentService.updateComment(req);

    res.status(response.status).json(response);
  },

  deleteComment: async (req, res) => {
    let response = await CommentService.deleteComment(req);

    res.status(response.status).json(response);
  },
};

module.exports = LoginController;
