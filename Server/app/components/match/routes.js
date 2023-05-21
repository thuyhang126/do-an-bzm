const express = require("express");
const router = express.Router();

const MatchController = require("./controllers/MatchController");
const CoreMiddleware = require("@core/middlewares/CoreMiddleware");

router.get("/random", CoreMiddleware.authenticated, (req, res, next) =>
  MatchController.listUserRandom(req, res)
);
router.get("/matched", CoreMiddleware.authenticated, (req, res, next) =>
  MatchController.getMatched(req, res)
);
router.post("/friends", CoreMiddleware.authenticated, (req, res, next) =>
  MatchController.getFriends(req, res)
);

module.exports = router;
