const express = require("express");
const router = express.Router();

const CommentController = require("./controllers/CommentController");
const CoreMiddleware = require("@core/middlewares/CoreMiddleware");
const multipleFile = require("@utilities/Storage");

router.post("/get", CoreMiddleware.authenticated, (req, res, next) =>
  CommentController.getAll(req, res)
);
router.post("/firstComment", CoreMiddleware.authenticated, (req, res, next) =>
  CommentController.getFirstComment(req, res)
);
router.post(
  "/",
  [CoreMiddleware.authenticated, multipleFile],
  (req, res, next) => CommentController.createComment(req, res)
);
router.post(
  "/update",
  [CoreMiddleware.authenticated, multipleFile],
  (req, res, next) => CommentController.updateComment(req, res)
);
router.delete("/", CoreMiddleware.authenticated, (req, res, next) =>
  CommentController.deleteComment(req, res)
);

module.exports = router;
