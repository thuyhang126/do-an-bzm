'use strict';

const InteractionUserService = require('@interaction/services/InteractionUserServices');

module.exports = {

   // create interaction
   createInteraction: async (req, res) => {
      let response = await InteractionUserService.createInteraction(req);
      res.status(response.status).json(response);
   },
};
