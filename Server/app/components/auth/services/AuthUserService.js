"use strict";

const bcrypt = require("bcryptjs");
const CoreUserRepository = require("@core/repositories/CoreUserRepository");
const Firebase = require("@utilities/Firebase");
const JwtToken = require("@utilities/JwtToken");
const { validationResult } = require("express-validator");
const salt = bcrypt.genSaltSync(10);

const admin = require("firebase-admin");
const serviceAccount = require("../../../../firebase_admin_service_account.json");
const { getAuth } = require("firebase-admin/auth");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const AuthUserService = {
  register: async (req) => {
    const { email, password, name } = req.body;

    if (!email || !name || !password) {
      return {
        error: true,
        status: 401,
        message: "Email is valid or password or name is empty!!!",
        data: {},
      };
    }

    const user = await CoreUserRepository.getUserByEmail(req.body.email);
    if (user)
      return {
        error: true,
        status: 401,
        message: "Email account exist",
        data: {},
      };

    const newUser = await CoreUserRepository.create({
      email,
      name,
      password: bcrypt.hashSync(password, salt),
    });

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        newUser,
      },
    };
  },

  login: async (req) => {
    if (!req.body.provider) {
      let response = {
        error: true,
        status: 401,
        message: "Email is valid or password is empty!!!",
        data: {},
      };

      if (req.body.email === undefined || req.body.password === undefined)
        return response;

      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return response;
      }

      let user = await CoreUserRepository.getUserByEmail(req.body.email);

      if (!user)
        return {
          error: true,
          status: 401,
          message: "Email account does not exist",
          data: {},
        };

      let passwordCompare = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordCompare)
        return {
          error: true,
          status: 401,
          message: "Your password does not match",
          data: {},
        };

      let accessToken = await JwtToken.sign(user);
      let refreshToken = await JwtToken.sign(user, "refresh");

      return {
        error: false,
        status: 200,
        message: "You are successfully logged in",
        data: {
          user,
          accessToken,
          refreshToken,
        },
      };
    } else {
      let response = {
        error: true,
        status: 400,
        message: "Invalid token",
        data: "",
      };

      await getAuth()
        .verifyIdToken(req.body.token)
        .then(async (tokenDecoded) => {
          let user = await CoreUserRepository.getUserByEmail(
            tokenDecoded.email
          );

          var isNewUser = false;

          if (!user) {
            user = await AuthUserService.createUserWithEmail({
              email: tokenDecoded.email,
              social_id:
                tokenDecoded.firebase.identities[
                  tokenDecoded.firebase.sign_in_provider
                ][0],
              avatar: tokenDecoded.picture,
              provider: req.body.provider,
              name: tokenDecoded.name,
            });
            isNewUser = true;
          }

          let checkFillInformation = await AuthUserService.checkInformation(
            user.id
          );

          let accessToken = await JwtToken.sign(user);
          let refreshToken = await JwtToken.sign(user, "refresh");

          response = {
            error: false,
            status: 200,
            fillInformationScreenOne:
              checkFillInformation.fillInformationScreenOne,
            fillInformationScreenTwo:
              checkFillInformation.fillInformationScreenTwo,
            message: "You are successfully logged in",
            isNewUser: isNewUser,

            data: {
              user,
              accessToken,
              refreshToken,
            },
          };
        })
        .catch((err) => {
          console.log(err);
        });

      return response;
    }
  },

  resetToken: async (credentials) => {
    let response = {
      error: true,
      status: 400,
      message:
        "The provided Refresh Token is either expired, was not found, or has been revoked.",
      data: {},
    };

    let user = await JwtToken.verify(credentials.refresh_token).user;

    if (!user) return response;

    let accessToken = await JwtToken.sign(user);

    let refreshToken = await JwtToken.sign(user, "refresh");

    return {
      error: false,
      status: 200,
      message: "Successful",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    };
  },

  createUserWithEmail: async (data) => {
    let user = await CoreUserRepository.create({
      email: data.email,
      social_id: data.social_id,
      avatar: data.avatar,
      provider: data.provider,
      name: data.name,
    });

    return {
      id: user.id,
      email: user.email,
      social_id: user.social_id,
      avatar: user.avatar,
      provider: user.provider,
    };
  },

  checkInformation: async (id) => {
    let response = {
      error: true,
      status: 401,
      fillInformationScreenOne: false,
      fillInformationScreenTwo: false,
      message: "You have not filled in screen information 1!!!",
      data: {},
    };

    let user = await CoreUserRepository.getUserById(id);

    if (
      !user.company ||
      !user.position ||
      !user.card_visit ||
      !user.business_model
    ) {
      return response;
    } else response.fillInformationScreenOne = true;

    response.message = "You have not filled in screen information 2!!!";
    if (!user.name || !user.purpose) {
      return response;
    } else response.fillInformationScreenTwo = true;

    response.message = "Successful!!!";
    response.data = user;

    return response;
  },

  getUsersDestroy: async (email) => {
    let response = {
      error: true,
      status: 401,
      message: "Email not entered",
      data: {},
    };

    if (!email) return response;

    let user = await CoreUserRepository.getUsersDestroy(email);

    response.message = "Account does not exist";

    if (user) {
      response.data = user;
      return response;
    }
    return {
      error: false,
      status: 200,
      message: "Successful",
    };
  },
};

module.exports = AuthUserService;
