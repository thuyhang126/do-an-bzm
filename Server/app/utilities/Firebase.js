'use strict';

const { OAuth2Client } = require('google-auth-library');
const { clientId, clientSecret } = require('@config/firebase');


module.exports = {
  verify: (token) => {
    const client = new OAuth2Client({
      clientId,
      clientSecret
    });

    return new Promise((resolve, reject) => {
      client.verifyIdToken({
        idToken: token,
        audience: clientId
      })
        .then(ticket => {
          resolve(ticket.getPayload());
        })
        .catch(err => {
          resolve({
            error: 'Token invalid or expired'
          });
        });
    });
  }
};
