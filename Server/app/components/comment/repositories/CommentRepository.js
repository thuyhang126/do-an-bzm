"use strict";

const db = require("@models");
const { Op } = require("sequelize");
const appConfig = require("@config/app");

module.exports = {
  getAll: async (data) => {
    const limitComment = appConfig.limitAllCv;
    const pageNumber = data.page ? data.page : 1;
    const rank = data.rank ? data.rank : 0;
    const belong = data.belong ? data.belong : null;
    return await db.Comment.findAll({
      where: {
        rank,
        belong,
        post_id: data.postId
      },
      include: [
        {
          model: db.User,
          attributes: ['avatar', 'name'],
          as: 'user',
        },
      ],
      order: [["created_at", "DESC"], ["id", "DESC"]],
      limit: +limitComment,
      offset: +limitComment * (pageNumber - 1)
    });
  },

  getFirstComment: async (data) => {
    const rank = data.rank ? data.rank : 0;
    const belong = data.belong ? data.belong : null;
    return await db.Comment.findOne({
      where: {
        rank,
        belong,
        post_id: data.postId
      },
    });
  },

  createComment: async (newComment) => {
    return await db.Comment.create(newComment);
  },

  updateComment: async (data) => {
    return await db.Comment.update(
      {
        title: data.title,
        likes: data.likes
      },
      {
        where: { id: data.id }
      });
  },

  findById: async (id) => {
    return await db.Comment.findOne({
      where: {
        id,
      },
    });
  },

  deleteComment: async (id) => {
    return await db.Comment.destroy({
      where: {
        id,
      }
    });
  },
}
