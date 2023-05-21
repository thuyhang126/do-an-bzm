"use strict";

const uuid = require("uuid");

const CoreUserRepository = require("@core/repositories/CoreUserRepository");
const ProfileUserRepository = require("@profile/repositories/ProfileUserRepository");
const appConfig = require("@config/app");
const AuthUserService = require("@auth/services/AuthUserService");

module.exports = {
  updateInformation: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "You can not update status!!!",
      data: {},
    };

    let userId = req.auth.id;

    if (req.body.status) return response;

    let escapeCharacter = "public";

    let user, filenameAvatar, filenameCardVisit;

    if (req.files?.avatar) {
      filenameAvatar =
        req.files.avatar[0].destination.substring(
          escapeCharacter.length,
          req.files.avatar[0].destination.length
        ) +
        "/" +
        req.files.avatar[0].filename;
    }

    if (req.files?.card_visit) {
      filenameCardVisit =
        req.files.card_visit[0].destination.substring(
          escapeCharacter.length,
          req.files.card_visit[0].destination.length
        ) +
        "/" +
        req.files.card_visit[0].filename;
    }

    if (req.files.avatar && req.files.card_visit) {
      user = await CoreUserRepository.updateUser(userId, {
        data: req.body,
        avatar: filenameAvatar,
        card_visit: filenameCardVisit,
      });
    } else if (req.files.avatar && !req.files.card_visit) {
      user = await CoreUserRepository.updateUser(userId, {
        data: req.body,
        avatar: filenameAvatar,
      });
    } else if (!req.files.avatar && req.files.card_visit) {
      user = await CoreUserRepository.updateUser(userId, {
        data: req.body,
        card_visit: filenameCardVisit,
      });
    } else if (!req.files.avatar && !req.files.card_visit) {
      user = await CoreUserRepository.updateUser(userId, { data: req.body });
    }

    if (!user) {
      return {
        error: true,
        status: 400,
        message: "Not find user!!!",
        data: {},
      };
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user: user,
      },
    };
  },

  //Get Thong tin user
  getProfile: async (req) => {
    let userId = req.auth.id;

    let user = await CoreUserRepository.getUserById(userId);

    if (!user) {
      return {
        error: true,
        status: 400,
        message: "Not find user!!!",
        data: {},
      };
    }

    let likeById = await ProfileUserRepository.getLikeById(userId);
    let receiveLikeById = await ProfileUserRepository.getReceivedLikeById(
      userId
    );
    let countLike = likeById.length;
    let countReceivedLike = receiveLikeById.length;

    user.dataValues.like = countLike;
    user.dataValues.received_like = countReceivedLike;

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user: user,
      },
    };
  },

  getProfileById: async (req) => {
    let userId = req.auth.id;

    let id = req.params.id;
    if (!id)
      return {
        error: true,
        status: 400,
        message: "Bad request!",
        data: {},
      };
    console.log(id);
    let user = await CoreUserRepository.getUserById(+id);

    if (!user) {
      return {
        error: true,
        status: 400,
        message: "Not find user!!!",
        data: {},
      };
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user,
      },
    };
  },

  updateCV: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "Email not entered!!!",
      data: {},
    };

    let userId = req.auth.id;

    if (!req.body.email) return response;

    let user = await CoreUserRepository.getUserByEmail(req.body.email);

    response.message = "Not found user!!!";
    if (!user) return response;

    response.message = "CV of user has been approved!!!";

    if (user.status === 1) return response;

    let userCV = await CoreUserRepository.updateCV(req.body.email);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user: userCV,
      },
    };
  },

  updateStatus: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "Email not entered!!!",
      data: {},
    };

    let userId = req.auth.id;

    if (!req.body.email) return response;

    let user = await CoreUserRepository.getUserByEmail(req.body.email);

    response.message = "Not found user!!!";
    if (!user) return response;

    response.message = "CV of user has been approved!!!";

    if (user.status === 1) return response;

    let userCV = await CoreUserRepository.updateStatus(req.body.email);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user: userCV,
      },
    };
  },

  quitUpdateCV: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "Not found user!!!",
      data: {},
    };

    let userId = req.auth.id;

    let user = await CoreUserRepository.getUserByEmail(req.body.email);

    if (!user) return response;

    response.message = "CV of user has quit update!!!";

    if (user.status === 0) return response;

    let userCV = await CoreUserRepository.quitUpdateCV(req.body.email);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user: userCV,
      },
    };
  },

  //offset
  updateAllCVLimit: async (req) => {
    let limit = +appConfig.limitAllCv;

    let response = {
      error: true,
      status: 400,
      message: "Not found users!!!",
      data: {},
    };

    let userId = req.auth.id;

    let offset = req.query.offset ? (req.body.offset - 1) * limit : 0;

    let users = await ProfileUserRepository.updateAllCVLimit({
      limit: limit,
      offset: offset,
    });

    if (!users) return response;

    let listEmailCV = users.map((user) => user.email);

    listEmailCV.forEach(
      async (email) => await CoreUserRepository.updateStatus(email)
    );

    /*    await CoreUserRepository.updateAllCV(listEmailCV); */

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {},
    };
  },

  updateAllCV: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "Not found users!!!",
      data: {},
    };

    let userId = req.auth.id;

    let users = await ProfileUserRepository.getAllCVProfiles();

    if (!users) return response;

    let listEmailCV = users.map((user) => user.email);

    await CoreUserRepository.updateAllCV(listEmailCV);

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {},
    };
  },

  getAllProfilesToCheck: async (req) => {
    let limit = +appConfig.limitAllCv;

    let response = {
      error: true,
      status: 400,
      message: "Invalid token",
      data: {},
    };

    let userId = req.auth.id;

    let offset = req.query.offset ? (req.query.offset - 1) * limit : 0;

    let users = await ProfileUserRepository.getAllProfilesToCheck({
      limit: limit,
      offset: offset,
    });

    if (!users) {
      return {
        error: true,
        status: 404,
        message: "Not get CV users",
        data: {},
      };
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        usersCV: users,
      },
    };
  },

  getAllProfilesChecked: async (req) => {
    let limit = +appConfig.limitAllCv;

    let response = {
      error: true,
      status: 400,
      message: "Invalid token",
      data: {},
    };

    let userId = req.auth.id;

    let offset = req.query.offset ? (req.query.offset - 1) * limit : 0;

    let users = await ProfileUserRepository.getAllProfilesChecked({
      limit: limit,
      offset: offset,
    });

    if (!users) {
      return {
        error: true,
        status: 404,
        message: "Not get CV users",
        data: {},
      };
    }

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        usersCV: users,
      },
    };
  },

  getAllCVProfiles: async (req) => {
    let userId = req.auth.id;

    let users = await ProfileUserRepository.getAllCVProfiles();

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        usersCV: users,
      },
    };
  },

  getAllCVChecked: async (req) => {
    let userId = req.auth.id;

    let users = await ProfileUserRepository.getAllCVChecked();

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        usersCV: users,
      },
    };
  },

  checkInformation: async (req) => {
    let userId = req.auth.id;

    let checkFillInformation = await AuthUserService.checkInformation(userId);

    return checkFillInformation;
  },

  deletedUser: async (req) => {
    let userId = req.auth.id;

    let users = await ProfileUserRepository.deletedUser(userId);

    return {
      error: false,
      status: 200,
      message: "Deleted successful",
      data: {},
    };
  },

  restoreUser: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "Email not entered!!!",
      data: {},
    };

    let userId = req.auth.id;

    if (!req.body.email) return response;

    let user = await ProfileUserRepository.restoreUser(req.body.email);

    response.message = "Not found user!!!";

    if (user[0].affectedRows === 0) return response;

    return {
      error: false,
      status: 200,
      message: "Restore successful",
      data: {},
    };
  },

  checkInviteCode: async (req) => {
    let response = {
      error: true,
      status: 400,
      message: "Invite code not entered!!!",
      data: {},
    };

    let email = req.auth.email;

    if (!req.body.invite_code) return response;

    let users = await ProfileUserRepository.checkInviteCode(
      req.body.invite_code
    );

    response.message = "Not found invite code!!!";
    if (!users) return response;

    let userCV = await CoreUserRepository.updateCV({
      email,
      register_code: req.body.invite_code,
      invite_code: uuid.v1().slice(0, 8),
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        hasInviteCode: true,
        userCV: userCV,
      },
    };
  },
};
