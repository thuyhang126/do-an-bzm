"use strict";

const PostService = require("../services/PostService");

const LoginController = {
  getAll: async (req, res) => {
    let response = await PostService.getAll(req);

    res.status(response.status).json(response);
  },

  getFirstPost: async (req, res) => {
    let response = await PostService.getFirstPost(req);

    res.status(response.status).json(response);
  },

  findById: async (req, res) => {
    let response = await PostService.findById(req);

    res.status(response.status).json(response);
  },

  createPost: async (req, res) => {
    let response = await PostService.createPost(req);

    res.status(response.status).json(response);
  },

  updatePost: async (req, res) => {
    let response = await PostService.updatePost(req);

    res.status(response.status).json(response);
  },

  deletePost: async (req, res) => {
    let response = await PostService.deletePost(req);

    res.status(response.status).json(response);
  },

  searchPost: async (req, res) => {
    let response = await PostService.searchPost(req);

    res.status(response.status).json(response);
  },

  countLikeAndComment: async (req, res) => {
    let response = await PostService.countLikeAndComment(req);

    res.status(response.status).json(response);
  },

  getPostByUser: async (req, res) => {
    let response = await PostService.getPostByUser(req);

    res.status(response.status).json(response);
  },
};

module.exports = LoginController;
