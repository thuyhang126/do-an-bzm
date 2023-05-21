'use strict';

const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000',
  uploadDestination: process.env.UPLOAD_DESTINATION || 'public/uploads/avatars',
  apiApp: process.env.API_APP || "http://localhost:8000",
  name: process.env.APP_NAME || 'NodeJS',
  env: process.env.APP_ENV || 'development',
  debug: process.env.APP_DEBUG || true,
  url: process.env.APP_URL || 'http://localhost',
  port: process.env.APP_PORT || 3000,
  timezone: process.env.APP_TIMEZONE || 'Etc/GMT0',
  limitProfile: process.env.LIMIT_PROFILES || 4,
  limitMatch: process.env.LIMIT_MATCH || 12,
  limitMessage: process.env.LIMIT_MESSAGES || 20,
  limitAllCv: process.env.LIMIT_ALLCV || 50,
  limitAllCv: process.env.LIMIT_POST || 15,
};
