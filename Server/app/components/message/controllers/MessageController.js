'use strict';

const MessageServices = require('@message/services/MessageServices');

module.exports = {
   getMessages: async (req, res) => {
      let response = await MessageServices.getMessages(req);

      res.status(response.status).json(response);
   },

   sentMessage: async (req, res) => {
      let response = await MessageServices.sentMessage(req);

      res.status(response.status).json(response);
   },

   updateSeenMessage: async (req, res) => {
      let response = await MessageServices.updateSeenMessage(req);

      res.status(response.status).json(response);
   },

   deleteMessage: async (req, res) => {
      let response = await MessageServices.deleteMessage(req);

      res.status(response.status).json(response);
   },
}
