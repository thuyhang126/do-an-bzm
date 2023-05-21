const express = require("express");
const router = express.Router();

const PostController = require("./controllers/PostController");
const CoreMiddleware = require("@core/middlewares/CoreMiddleware");
const multipleFile = require("@utilities/Storage");

router.post("/get", CoreMiddleware.authenticated, (req, res, next) =>
  PostController.getAll(req, res)
);
router.post("/byUser", CoreMiddleware.authenticated, (req, res, next) =>
  PostController.getPostByUser(req, res)
);
router.post("/firstPost", CoreMiddleware.authenticated, (req, res, next) =>
  PostController.getFirstPost(req, res)
);
router.get("/:id", CoreMiddleware.authenticated, (req, res, next) =>
  PostController.findById(req, res)
);
router.post(
  "/",
  [CoreMiddleware.authenticated, multipleFile],
  (req, res, next) => PostController.createPost(req, res)
);
router.put(
  "/",
  [CoreMiddleware.authenticated, multipleFile],
  (req, res, next) => PostController.updatePost(req, res)
);
router.delete("/", CoreMiddleware.authenticated, (req, res, next) =>
  PostController.deletePost(req, res)
);
router.post("/count", CoreMiddleware.authenticated, (req, res, next) =>
  PostController.countLikeAndComment(req, res)
);

module.exports = router;
