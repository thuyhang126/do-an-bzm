const express = require("express");
const router = express.Router();

const ProfileController = require("./controllers/ProfileController");
const CoreMiddleware = require("@core/middlewares/CoreMiddleware");
const multipleFile = require("@utilities/Storage");

router.put(
  "/update",
  [CoreMiddleware.authenticated, multipleFile],
  (req, res) => ProfileController.updateInformation(req, res)
);
router.get("/", CoreMiddleware.authenticated, (req, res, next) =>
  ProfileController.getProfile(req, res)
);
router.get("/:id", CoreMiddleware.authenticated, (req, res, next) =>
  ProfileController.getProfileById(req, res)
);
router.get(
  "/checkInformation",
  CoreMiddleware.authenticated,
  (req, res, next) => ProfileController.checkInformation(req, res)
);
router.put(
  "/updateCV",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.updateCV(req, res)
);
router.put(
  "/updateStatus",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.updateStatus(req, res)
);
router.put(
  "/quitUpdateCV",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.quitUpdateCV(req, res)
);
router.put(
  "/updateAllCV",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.updateAllCV(req, res)
);
router.put(
  "/updateAllCVLimit",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.updateAllCVLimit(req, res)
);
router.get(
  "/listCV",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.getAllProfilesToCheck(req, res)
);
router.get(
  "/getAllProfilesChecked",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.getAllProfilesChecked(req, res)
);
router.get(
  "/getAllCVProfiles",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.getAllCVProfiles(req, res)
);
router.get(
  "/getAllCVChecked",
  [CoreMiddleware.authenticated, CoreMiddleware.hasAdminRole],
  (req, res) => ProfileController.getAllCVChecked(req, res)
);
router.delete("/deletedUser", CoreMiddleware.authenticated, (req, res, next) =>
  ProfileController.deletedUser(req, res)
);
router.post("/restoreUser", CoreMiddleware.authenticated, (req, res, next) =>
  ProfileController.restoreUser(req, res)
);
router.post("/code", CoreMiddleware.authenticated, (req, res, next) =>
  ProfileController.checkInviteCode(req, res)
);

module.exports = router;
