'use strict';

const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
    clientId: process.env.FIREBASE_CLIENT_ID,
    clientSecret: process.env.FIREBASE_CLIENT_SECRET
};
