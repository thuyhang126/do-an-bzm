"use strict";

const db = require("@models");
const { Op } = require("sequelize");

module.exports = {
  //get matches (phan trang)
  getMatched: async (id) => {
    return await db.Match.findAll({
      where: {
        [Op.or]: [{ user_id: id }, { object_id: id }],
      },
    });
  },

  getCheckMatch: async (data) => {
    return await db.Match.findOne({
      where: {
        [Op.or]: [
          { user_id: data.user_id, object_id: data.object_id },
          { object_id: data.user_id, user_id: data.object_id },
        ],
      },
      raw: true,
    });
  },

  //get create_at one match
  getCreateAtMatch: async (data) => {
    let match = await db.Match.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_id: data.userId }, { object_id: data.object_id }],
          },
          {
            [Op.and]: [{ user_id: data.object_id }, { object_id: data.userId }],
          },
        ],
      },
      attributes: ["created_at"],
    });
    return {
      message: "",
      sent_at: match.created_at,
    };
  },

  //create matches
  createMatch: async (data) => {
    await db.Match.create({
      user_id: data.sender_id,
      object_id: data.receiver_id,
    });
  },

  checkHasMatch: async (data) => {
    return await db.Match.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_id: data.userId }, { object_id: data.object_id }],
          },
          {
            [Op.and]: [{ user_id: data.object_id }, { object_id: data.userId }],
          },
        ],
      },
    });
  },
};
