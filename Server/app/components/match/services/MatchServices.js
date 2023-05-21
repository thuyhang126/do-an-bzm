"use strict";

const CoreUserRepository = require("@core/repositories/CoreUserRepository");
const MessageRepository = require("@message/repositories/MessageRepository");
const MatchRepositories = require("@match/repositories/MatchRepository");
const InteractionUserRepository = require("@interaction/repositories/InteractionUserRepository");
const ProfileUserRepository = require("@profile/repositories/ProfileUserRepository");
const appConfig = require("@config/app");

const MatchServices = {
  //Get 4 profile matches
  getUserRandom: async (req) => {
    const profiles = appConfig.limitProfile;

    let userId = req.auth.id;

    let allUserIdLikeOrUnlike = (
      await InteractionUserRepository.allUserIdLikeOrUnlike(userId)
    ).map((user) => user.receiver_id);

    let arrayUserDelete = await CoreUserRepository.getAllUserDestroyByiId();

    arrayUserDelete.forEach((userDelete) =>
      allUserIdLikeOrUnlike.push(userDelete.dataValues.id)
    );

    allUserIdLikeOrUnlike.push(+userId);

    let allUserOffline = await CoreUserRepository.getUserOffline();
    let index;
    allUserOffline.forEach((item) => {
      index = allUserIdLikeOrUnlike.findIndex((id) => {
        if (id === item.id) return id;
      });
      if (index === -1) {
        allUserIdLikeOrUnlike.push(item.id);
      }
    });

    let allIdUsers = (await CoreUserRepository.getAllUserOnline()).map(
      (user) => user.id
    );

    let IdsRandom;

    for (let i = 0; i < allUserIdLikeOrUnlike.length; i++) {
      IdsRandom = allIdUsers.filter(
        (item) => item !== allUserIdLikeOrUnlike[i]
      );
      allIdUsers = IdsRandom;
    }

    let indexMatches = [];

    if (IdsRandom.length > 4) {
      for (let i = 0; i < profiles; i++) {
        do {
          var x = Math.floor(Math.random() * IdsRandom.length);
        } while (i > 0 && indexMatches.includes(x));
        indexMatches.push(x);
      }

      let idMatches = indexMatches.map((i) => IdsRandom[i]);

      var listUserMatches = await CoreUserRepository.getUsersWhereArray(
        idMatches
      );
    } else
      var listUserMatches = await CoreUserRepository.getUsersWhereArray(
        IdsRandom
      );

    let arrayUserMatches = [];

    for (let i = 0; i < listUserMatches.length; i++) {
      if (
        listUserMatches[i].name &&
        listUserMatches[i].purpose &&
        listUserMatches[i].company &&
        listUserMatches[i].business_model &&
        listUserMatches[i].position
      ) {
        let likeById = await ProfileUserRepository.getLikeById(
          listUserMatches[i].id
        );
        let receiveLikeById = await ProfileUserRepository.getReceivedLikeById(
          listUserMatches[i].id
        );
        listUserMatches[i].dataValues.like = likeById.length;
        listUserMatches[i].dataValues.received_like = receiveLikeById.length;
        arrayUserMatches.push(listUserMatches[i]);
      }
    }

    if (!arrayUserMatches) {
      return {
        error: true,
        status: 400,
        message: "Not find list user!!!",
        data: {},
      };
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        arrayUserMatches: arrayUserMatches,
      },
    };
  },

  getAllMatches: async (req) => {
    let userId = req.auth.id;

    let matches = await MatchRepositories.getMatched(userId);

    let allMatches = [];
    let arrayUserMatch = [];

    const addInfoMessageLast = async (userId, match, info) => {
      let messageLast = await MessageRepository.getMessagesLast({
        userId: userId,
        object_id: match.user_id === userId ? match.object_id : match.user_id,
      });

      if (!messageLast) {
        messageLast = await MatchRepositories.getCreateAtMatch({
          userId: userId,
          object_id: match.user_id === userId ? match.object_id : match.user_id,
        });
      }

      match.dataValues.user = info;
      match.dataValues.messageLast = messageLast;

      allMatches.push(match);

      arrayUserMatch = allMatches.filter((match) => {
        if (match.dataValues.user !== null) return match;
      });

      let arrayUserDelete = allMatches.filter((match) => {
        if (match.dataValues.user === null) return match;
      });

      for (let i = 0; i < arrayUserDelete.length; i++) {
        let userDelete;
        let idUserDelete;
        if (arrayUserDelete[i].dataValues.object_id === userId) {
          idUserDelete = arrayUserDelete[i].dataValues.user_id;
        } else {
          idUserDelete = arrayUserDelete[i].dataValues.object_id;
        }
        userDelete = await CoreUserRepository.getUserDestroyByiId(idUserDelete);

        arrayUserDelete[i].dataValues.user = userDelete;
      }

      arrayUserMatch = [...arrayUserMatch, ...arrayUserDelete];
    };

    for (let i = 0; i < matches.length; i++) {
      let match = matches[i];

      let info =
        match.user_id === userId
          ? await CoreUserRepository.getUserById(match.object_id)
          : await CoreUserRepository.getUserById(match.user_id);

      if (!info) {
        info =
          match.user_id === userId
            ? await CoreUserRepository.getUserDestroyByiId(match.object_id)
            : await CoreUserRepository.getUserDestroyByiId(match.user_id);
      }
      if (req.query.name) {
        if (
          info.name.toLowerCase().search(req.query.name.toLowerCase()) !== -1
        ) {
          await addInfoMessageLast(userId, match, info);
        }
      } else {
        await addInfoMessageLast(userId, match, info);
      }
    }

    let matchesTime = arrayUserMatch.map((e) =>
      Math.round(new Date(e.dataValues.messageLast.sent_at))
    );
    matchesTime.sort().reverse();

    let matchesTimeSort = [];

    for (let i = 0; i < matchesTime.length; i++) {
      let findIndexMatch = arrayUserMatch.findIndex(
        (match) =>
          Math.round(new Date(match.dataValues.messageLast.sent_at)) ===
          matchesTime[i]
      );

      if (findIndexMatch !== -1) {
        matchesTimeSort.push(arrayUserMatch[findIndexMatch]);
        arrayUserMatch.splice(findIndexMatch, 1);
      }
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        matchesTimeSort: matchesTimeSort,
      },
    };
  },

  getMatches: async (req) => {
    let limit = +appConfig.limitMatch;

    let response = await MatchServices.getAllMatches(req);

    let allMatches = response.data.matchesTimeSort;

    let offset = req.query.offset ? (req.query.offset - 1) * limit : 0;

    let matches = allMatches.slice(offset, limit + offset);

    for (let i = 0; i < matches.length; i++) {
      let likeById = await ProfileUserRepository.getLikeById(
        matches[i].dataValues.user.id
      );

      let receiveLikeById = await ProfileUserRepository.getReceivedLikeById(
        matches[i].dataValues.user.id
      );
      matches[i].dataValues.user.dataValues.like = likeById.length;
      matches[i].dataValues.user.dataValues.received_like =
        receiveLikeById.length;
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        listMatches: matches,
      },
    };
  },

  getFriends: async (req) => {
    let userId = req.auth.id;

    const friendOfUserId = req.body.id;

    if (!friendOfUserId)
      return {
        error: true,
        status: 400,
        message: "Bad request!",
      };

    req.auth.id = friendOfUserId;

    let response = await MatchServices.getAllMatches(req);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        friends: response.data.matchesTimeSort,
      },
    };
  },
};

module.exports = MatchServices;
