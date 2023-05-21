"use strict";

const LikeRepository = require("@like/repositories/LikeRepository");

const errRequest = {
  error: true,
  status: 400,
  message: "Bad request!",
  data: {},
}

const errAuthorized = {
  error: true,
  status: 403,
  message: "not authorized!",
  data: {},
}

module.exports = {
  createLike: async (req) => {
    let userId = req.auth.id;

    const post_id = req.body.post_id;

    if(!post_id) return errRequest;

    const like = await LikeRepository.createLike({post_id, liker_id: userId});

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        like,
      },
    }
  },

  deleteLike: async (req) => {
    let userId = req.auth.id;

    const post_id = req.body.post_id;

    if(!post_id) return errRequest;

    const result = await LikeRepository.deleteLike(userId, post_id);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        result,
      },
    }
  },
}
