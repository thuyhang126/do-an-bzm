"use strict";

const db = require("@models");
const ProfileUserService = require("@profile/services/ProfileUserService");

module.exports = {
  //check profile
  checkInformation: async (req, res) => {
    let response = await ProfileUserService.checkInformation(req);
    res.status(response.status).json(response);
  },

  //check invite_code
  checkInviteCode: async (req, res) => {
    let response = await ProfileUserService.checkInviteCode(req);
    res.status(response.status).json(response);
  },

  //update profile
  updateInformation: async (req, res) => {
    let response = await ProfileUserService.updateInformation(req);
    res.status(response.status).json(response);
  },

  //get profile
  getProfile: async (req, res) => {
    let response = await ProfileUserService.getProfile(req);
    res.status(response.status).json(response);
  },

  //get profile
  getProfileById: async (req, res) => {
    let response = await ProfileUserService.getProfileById(req);
    res.status(response.status).json(response);
  },

  //getAllCVProfiles
  getAllCVProfiles: async (req, res) => {
    let response = await ProfileUserService.getAllCVProfiles(req);
    res.status(response.status).json(response);
  },

  //getAllCVProfiles đã duyệt )
  getAllCVChecked: async (req, res) => {
    let response = await ProfileUserService.getAllCVChecked(req);
    res.status(response.status).json(response);
  },

  //getAllProfilesToCheck (offset)
  getAllProfilesToCheck: async (req, res) => {
    let response = await ProfileUserService.getAllProfilesToCheck(req);
    res.status(response.status).json(response);
  },

  //getAllProfiles da Check (offset)
  getAllProfilesChecked: async (req, res) => {
    let response = await ProfileUserService.getAllProfilesChecked(req);
    res.status(response.status).json(response);
  },

  //update duyet CV
  updateCV: async (req, res) => {
    let response = await ProfileUserService.updateCV(req);
    res.status(response.status).json(response);
  },

  //hủy duyet CV
  quitUpdateCV: async (req, res) => {
    let response = await ProfileUserService.quitUpdateCV(req);
    res.status(response.status).json(response);
  },

  updateStatus: async (req, res) => {
    let response = await ProfileUserService.updateStatus(req);
    res.status(response.status).json(response);
  },

  //update duyet tat ca CV
  updateAllCV: async (req, res) => {
    let response = await ProfileUserService.updateAllCV(req);
    res.status(response.status).json(response);
  },

  // update theo limit
  updateAllCVLimit: async (req, res) => {
    let response = await ProfileUserService.updateAllCVLimit(req);
    res.status(response.status).json(response);
  },

  getAllCV: async (req, res) => {
    let response = await ProfileUserService.getAllCVProfiles(req);
    res.status(response.status).json(response);
  },

  uploadAvatar: async (req, res) => {
    let response = await ProfileUserService.uploadAvatar(req);

    res.status(response.status).json(response);
  },
  deletedUser: async (req, res) => {
    let response = await ProfileUserService.deletedUser(req);

    res.status(response.status).json(response);
  },

  restoreUser: async (req, res) => {
    let response = await ProfileUserService.restoreUser(req);

    res.status(response.status).json(response);
  },
};
