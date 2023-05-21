"use strict";

const PostRepository = require("@post/repositories/PostRepository");

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

    const allPost = await PostRepository.getAll(req.body.page);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        posts: allPost,
      },
    };
  },

  getFirstPost: async (req) => {
    let userId = req.auth.id;

    const firstPost = await PostRepository.getFirstPost();

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        firstPost,
      },
    };
  },

  findById: async (req) => {
    let userId = req.auth.id;

    const idPost = req.params.id;
    const post = await PostRepository.findById(idPost);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        post,
      },
    };
  },

  createPost: async (req) => {
    let userId = req.auth.id;
    let escapeCharacter = "public";
    let images;

    if (req.files.images) {
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

    const post = await PostRepository.createPost({
      ...req.body,
      poster_id: userId,
      images,
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        post,
      },
    };
  },

  updatePost: async (req) => {
    let userId = req.auth.id;
    let post;

    if (!req.body.id) return errRequest;
    const postUpdate = await PostRepository.findById(req.body.id);

    if (userId !== postUpdate?.poster_id) return errRequest;

    let escapeCharacter = "public";
    let images = [];

    if (req.files.images) {
      req.files.images.forEach((image, i) => {
        let newImage =
          image.destination.substring(
            escapeCharacter.length,
            image.destination.length
          ) +
          "/" +
          image.filename;

        images.push(newImage);
      });

      post = await PostRepository.updatePost({ ...req.body, images });
    } else {
      post = await PostRepository.updatePost(req.body);
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        post,
      },
    };
  },

  deletePost: async (req) => {
    let userId = req.auth.id;

    const idPost = req.body.id;

    if (!idPost) return errRequest;

    const post = await PostRepository.findById(idPost);

    if (!post) return errRequest;

    if (post.poster_id !== userId) errAuthorized;

    const result = await PostRepository.deletePost(idPost);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        result,
      },
    };
  },

  searchPost: async (req) => {
    let userId = req.auth.id;

    if (!req.body.key) return errRequest;

    const posts = await PostRepository.searchPost(req.body.key);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        posts,
      },
    };
  },

  countLikeAndComment: async (req) => {
    let userId = req.auth.id;

    if (!req.body.post_id) return errRequest;

    const counts = await PostRepository.countLikeAndComment(
      req.body.post_id,
      userId
    );

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        counts,
      },
    };
  },

  getPostByUser: async (req) => {
    let userId = req.auth.id;

    let poster_id = req.body.poster_id;
    if (!poster_id) return errRequest;

    const posts = await PostRepository.getPostByUser({
      page: req.body.page,
      poster_id,
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        posts,
      },
    };
  },
};
