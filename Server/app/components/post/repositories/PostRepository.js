"use strict";

const db = require("@models");
const { Op } = require("sequelize");
const appConfig = require("@config/app");

module.exports = {
  getAll: async (page) => {
    const limitPost = appConfig.limitAllCv;
    const pageNumber = page ? page : 1;
    return await db.Post.findAll({
      limit: +limitPost,
      offset: +limitPost * (pageNumber - 1),
      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
      include: [
        {
          model: db.User,
          attributes: ["avatar", "name"],
          as: "user",
        },
      ],
    });
  },

  getPostByUser: async (data) => {
    const { page, poster_id } = data;
    const limitPost = appConfig.limitAllCv;
    const pageNumber = page ? page : 1;
    return await db.Post.findAll({
      where: { poster_id },
      limit: +limitPost,
      offset: +limitPost * (pageNumber - 1),
      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
      include: [
        {
          model: db.User,
          attributes: ["avatar", "name"],
          as: "user",
        },
      ],
    });
  },

  getFirstPost: async () => {
    return await db.Post.findOne();
  },

  findById: async (id) => {
    return await db.Post.findOne({
      where: {
        id,
      },
      // include: [
      //   {
      //     model: db.Like,
      //     as: "likes",
      //   },
      //   {
      //     model: db.Comment,
      //     as: "comments",
      //   },
      // ],
    });
  },

  createPost: async (newPost) => {
    console.log(newPost);
    return await db.Post.create(newPost);
  },

  updatePost: async (data) => {
    await db.Post.update(
      {
        images: data.images,
        category: data.category,
        title: data.title,
      },
      {
        where: { id: data.id },
      }
    );

    return await db.Post.findOne({
      where: {
        id: data.id,
      },
      include: [
        {
          model: db.Like,
          as: "likes",
        },
        {
          model: db.Comment,
          as: "comments",
        },
      ],
    });
  },

  deletePost: async (id) => {
    return await db.Post.destroy({
      where: {
        id,
      },
    });
  },

  searchPost: async (data) => {
    const limitPost = appConfig.limitAllCv;
    const pageNumber = data.page ? data.page : 1;
    return await db.Post.getAll({
      where: {
        category: data.category,
      },
      limit: +limitPost,
      offset: +limitPost * (pageNumber - 1),
    });
  },

  countLikeAndComment: async (post_id, userId) => {
    const countLike = await db.Like.count({
      where: {
        post_id,
      },
    });

    const countComment = await db.Comment.count({
      where: {
        post_id,
      },
    });

    let isLike = await db.Like.findOne({
      where: {
        post_id,
        liker_id: userId,
      },
    });

    isLike ? (isLike = true) : (isLike = false);

    return {
      countLike,
      countComment,
      isLike,
    };
  },
};
