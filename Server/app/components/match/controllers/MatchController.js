"use strict";

const MatchServices = require("@match/services/MatchServices");

module.exports = {
  //random 4 matches
  listUserRandom: async (req, res) => {
    let response = await MatchServices.getUserRandom(req);

    res.status(response.status).json(response);
  },

  //get matches (thong tin profile, tin cuoi cung, trang thai, phan trang)
  getMatched: async (req, res) => {
    let response = await MatchServices.getMatches(req);

    res.status(response.status).json(response);
  },

  //All matches to search
  searchMatch: async (req, res) => {
    let response = await MatchServices.searchMatch(req);

    res.status(response.status).json(response);
  },

  getFriends: async (req, res) => {
    let response = await MatchServices.getFriends(req);

    res.status(response.status).json(response);
  },
};
