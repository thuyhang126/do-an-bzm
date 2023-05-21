"use strict";

const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

let jwt = {
  secret: process.env.JWT_SECRET || "secret",
  // access token
  accessTokenOptions: {
    algorithm: process.env.JWT_ALGO || "HS256",
    expiresIn: process.env.JWT_TAT || 60000,
  },
  //refresh token
  refreshTokenOptions: {
    algorithm: process.env.JWT_ALGO || "HS256",
    expiresIn: process.env.JWT_TRT || 300000,
  },
};

if (process.env.JWT_TAT === "null") {
  delete jwt.accessTokenOptions.expiresIn;
}

module.exports = jwt;
