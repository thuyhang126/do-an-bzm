"use strict";

const MessageRepository = require("@message/repositories/MessageRepository");
const MatchRepository = require("@match/repositories/MatchRepository");
const { validationResult } = require("express-validator");
const appConfig = require("@config/app");

module.exports = {
  getMessages: async (req) => {
    const { receiver_id, message_id } = req.body;
    let userId = req.auth.id;

    if (!receiver_id) {
      return {
        error: true,
        status: 400,
        message: "Not find receiver_id!!!",
        data: {},
      };
    }

    let messageList = await MessageRepository.getMessages({
      userId,
      receiver_id,
      message_id,
    });

    if (!messageList) {
      return {
        error: true,
        status: 400,
        message: "Not find list message!!!",
        data: {},
      };
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        messageList: messageList,
      },
    };
  },

  sentMessage: async (req) => {
    let response = {
      error: true,
      status: 403,
      message: "Message is not empty!!!",
      data: {},
    };

    const errors = validationResult(req);
    if (!errors.isEmpty() && !req.files.images) {
      return response;
    }

    let userId = req.auth.id;

    let checkHasMatch = await MatchRepository.checkHasMatch({
      userId: userId,
      object_id: req.body.receiver_id,
    });

    response.message = "You two have not matched yet!!!";

    if (!checkHasMatch) return response;

    req.body.sender_id = userId;

    let escapeCharacter = "public";
    let images = "";

    console.log(req.files.images);

    if (req.files.images) {
      req.files.images.forEach(
        (image) =>
          (images +=
            "![](" +
            appConfig.apiApp +
            image.destination.substring(
              escapeCharacter.length,
              image.destination.length
            ) +
            "/" +
            image.filename +
            ")")
      );
    }

    req.body.message = images;

    const newMessage = await MessageRepository.sentMessage(req.body);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        message: newMessage,
      },
    };
  },

  updateSeenMessage: async (req) => {
    let userId = req.auth.id;

    let messagesNotSeen = await MessageRepository.getAllMessagesNotSeen({
      userId,
      object_id: req.body.receiver_id,
    });

    let idMessagesNotSeen = messagesNotSeen.map((message) => message.id);

    await MessageRepository.updateSeenMessage(idMessagesNotSeen);

    return {
      error: false,
      status: 200,
      message: "Updated Successful",
      data: {},
    };
  },

  deleteMessage: async (req) => {
    let userId = req.auth.id;

    const idMessage = req.body.id;

    if (!idMessage) return errRequest;

    const message = await MessageRepository.findById(idMessage);

    if (!message) return errRequest;

    if (message.sender_id !== userId) errAuthorized;

    const result = await MessageRepository.deleteMessage(idMessage);

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
