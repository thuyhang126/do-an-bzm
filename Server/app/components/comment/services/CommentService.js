"use strict";

const CommentRepository = require("@comment/repositories/CommentRepository");
const appConfig = require("@config/app");

const errRequest = {
  error: true,
  status: 400,
  message: "Bad request!",
  data: {},
};

const errAuthorized = {
  error: true,
  status: 403,
  message: "not authorized!",
  data: {},
};

module.exports = {
  getAll: async (req) => {
    let userId = req.auth.id;

    if (!req.body.postId) return errRequest;

    const allComment = await CommentRepository.getAll({ ...req.body });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        comments: allComment,
        userId,
      },
    };
  },

  getFirstComment: async (req) => {
    let userId = req.auth.id;

    if (!req.body.postId) return errRequest;

    const firstComment = await CommentRepository.getFirstComment({
      ...req.body,
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        firstComment,
      },
    };
  },

  createComment: async (req) => {
    let userId = req.auth.id;

    const post_id = +req.body.post_id;

    if (!post_id) return errRequest;

    let escapeCharacter = "public";
    let images;

    if (req.files.images?.length) {
      images = req.files.images.map(
        (image) =>
          image.destination.substring(
            escapeCharacter.length,
            image.destination.length
          ) +
          "/" +
          image.filename
      );
    }

    const comment = await CommentRepository.createComment({
      post_id,
      commenter_id: userId,
      ...req.body,
      title: req.files.images?.length
        ? `${req.body.title}![](${appConfig.apiApp}${images[0]})`
        : req.body.title,
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        comment,
      },
    };
  },

  updateComment: async (req) => {
    console.log(req.body);
    let userId = req.auth.id;

    if (!req.body.id) return errRequest;

    const commentUpdate = await CommentRepository.findById(req.body.id);

    if (!commentUpdate) return errRequest;

    if (req.body.title && userId !== commentUpdate.commenter_id)
      return errRequest;

    let escapeCharacter = "public";
    let images;

    if (req.files?.images?.length) {
      images = req.files.images.map(
        (image) =>
          image.destination.substring(
            escapeCharacter.length,
            image.destination.length
          ) +
          "/" +
          image.filename
      );
    }

    const comment = await CommentRepository.updateComment({
      ...req.body,
      title: req.files?.images?.length
        ? `${req.body.title}![](${appConfig.apiApp}${images[0]})`
        : req.body.title,
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        comment,
      },
    };
  },

  deleteComment: async (req) => {
    let userId = req.auth.id;

    const idComment = req.body.id;

    if (!idComment) return errRequest;

    const comment = await CommentRepository.findById(idComment);

    if (!comment) return errRequest;

    if (comment.commenter_id !== userId) errAuthorized;

    const result = await CommentRepository.deleteComment(idComment);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        result,
      },
    };
  },
};
