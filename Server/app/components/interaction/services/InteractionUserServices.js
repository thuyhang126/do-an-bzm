'use strict';

const CoreUserRepository = require('@core/repositories/CoreUserRepository');
const InteractionUserServices = require('@interaction/repositories/InteractionUserRepository');
const MatchRepository = require('@match/repositories/MatchRepository');
const MessageRepository = require("@message/repositories/MessageRepository");

module.exports = {

   //Create interactions
   createInteraction: async (req) => {
      let response = {
         error: true,
         status: 401,
         message: 'Action k hợp lệ (phải là liked or unliked!)',
         data: {}
      };

      let userId = req.auth.id;

      if (req.body.action !== 'liked' && req.body.action !== 'unliked') return response;

      response.message = 'You not like yourself!!!';

      if (+req.body.receiver_id === userId) return response;

      let userReceiver = await CoreUserRepository.getUserById(req.body.receiver_id);

      response.message = 'User has receiver_id not found!!!';

      if (!userReceiver) return response;

      //check userId liked receiver_id
      let checkLiked = await InteractionUserServices.checkLiked({ receiver_id: req.body.receiver_id, sender_id: userId });

      response.message = 'You have like receiver_id!!!';

      if (checkLiked) return response;

      await InteractionUserServices.createInteraction({
         sender_id: userId,
         receiver_id: req.body.receiver_id,
         action: req.body.action,
      });

      if (await InteractionUserServices.checkLiked({ receiver_id: userId, sender_id: req.body.receiver_id }) && req.body.action === 'liked') {
         let checkMatch = await MatchRepository.getCheckMatch({user_id: userId, object_id: req.body.receiver_id});
         if(!checkMatch) {
            await MatchRepository.createMatch({ receiver_id: userId, sender_id: req.body.receiver_id });
            await MessageRepository.sentMessage({sender_id: userId, receiver_id: req.body.receiver_id, message: "", sent_at: new Date()});
         }
      };

      return {
         error: false,
         status: 200,
         message: 'Successful',
         data: {}
      };
   }
};
