"use strict";

const db = require("@models");
const { Op } = require("sequelize");

module.exports = {
  //Find user from receiver_id to create match
  checkLiked: async (data) => {
    return await db.Interaction.findOne({
      where: {
        [Op.and]: [
          { receiver_id: data.receiver_id },
          { action: "liked" },
          { sender_id: data.sender_id },
        ],
      },
    });
  },

  //create interaction when liked or unliked
  createInteraction: async (data) => {
    await db.Interaction.create({
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      action: data.action,
    });
  },

  allUserIdLikeOrUnlike: async (id) => {
    return await db.Interaction.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ sender_id: id }, { action: "liked" }],
          },
          {
            [Op.and]: [{ sender_id: id }, { action: "unliked" }],
          },
        ],
      },
    });
  },
};
