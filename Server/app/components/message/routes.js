const express = require("express");
const router = express.Router();

const MessageController = require("@message/controllers/MessageController");
const CoreMiddleware = require("@core/middlewares/CoreMiddleware");
const MessageRequest = require("@message/request/MessageRequest");
const multipleFile = require("@utilities/Storage");

router.post("/", CoreMiddleware.authenticated, (req, res, next) =>
  MessageController.getMessages(req, res)
);
router.post(
  "/sent-message",
  [CoreMiddleware.authenticated, multipleFile],
  MessageRequest.rules,
  (req, res, next) => MessageController.sentMessage(req, res)
);
router.put("/seen-message", CoreMiddleware.authenticated, (req, res, next) =>
  MessageController.updateSeenMessage(req, res)
);
router.delete("/", CoreMiddleware.authenticated, (req, res, next) =>
  MessageController.deleteMessage(req, res)
);

module.exports = router;
