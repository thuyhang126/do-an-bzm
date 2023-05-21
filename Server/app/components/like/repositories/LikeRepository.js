"use strict";

const db = require("@models");
const { Op } = require("sequelize");
const appConfig = require("@config/app");

module.exports = {
  createLike: async (newLike) => {
    return await db.Like.create(newLike);
  },

  findById: async (id) => {
    return await db.Like.findOne({
      where: {
        id,
      },
    });
  },

  deleteLike: async (userId, post_id) => {
    return await db.Like.destroy({
      where: {
        liker_id: userId,
        post_id
      }
    });
  },
}
