"use strict";

const db = require("@models");
const { Op } = require("sequelize");
const appConfig = require("@config/app");

module.exports = {
  getMessages: async (data) => {
    if (data.message_id) {
      return db.Message.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { sender_id: data.userId },
                { receiver_id: data.receiver_id },
                {
                  id: {
                    [Op.lt]: data.message_id,
                  },
                },
              ],
            },
            {
              [Op.and]: [
                { sender_id: data.receiver_id },
                { receiver_id: data.userId },
                {
                  id: {
                    [Op.lt]: data.message_id,
                  },
                },
              ],
            },
          ],
        },
        order: [["sent_at", "DESC"], ["id", "DESC"]],
        limit: appConfig.limitMessage
      });
    } else {
      return db.Message.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { sender_id: data.userId },
                { receiver_id: data.receiver_id },
              ],
            },
            {
              [Op.and]: [
                { sender_id: data.receiver_id },
                { receiver_id: data.userId },
              ],
            },
          ],
        },
        order: [["sent_at", "DESC"], ["id", "DESC"]],
        limit: appConfig.limitMessage
      });
    }
  },

  //get messages
  getMessagesLast: async (data) => {
    return await db.Message.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { sender_id: data.userId },
              { receiver_id: data.object_id },
            ],
          },
          {
            [Op.and]: [
              { sender_id: data.object_id },
              { receiver_id: data.userId },
            ],
          },
        ],
      },
      order: [["sent_at", "DESC"]],
    });
  },

  //create message when sent
  sentMessage: async (data) => {
    return await db.Message.create({
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      message: data.message,
      sent_at: new Date(),
    });
  },

  getAllMessagesNotSeen: async (data) => {
    return await db.Message.findAll({
      where: {
        seen_at: null,
        [Op.and]: [{ sender_id: data.object_id }, { receiver_id: data.userId }],
      },
    });
  },

  updateSeenMessage: async (arrayIds) => {
    await db.Message.update(
      { seen_at: new Date() },
      {
        where: {
          id: arrayIds,
        },
      }
    );

    return await db.Message.findAll({
      where: {
        id: arrayIds,
      }
    })
  },

  findById: async (id) => {
    return await db.Message.findOne({
      where: {
        id,
      },
    });
  },


  deleteMessage: async (id) => {
    return await db.Message.destroy({
      where: {
        id,
      }
    });
  },
};
