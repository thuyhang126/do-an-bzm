'use strict';

const db = require('@models');
const { Op } = require('sequelize');

module.exports = {
   getAllProfilesToCheck: async (data) => {
      return await db.User.findAll({
         where: {
            [Op.or]: [
               { status: 0 },
               { status: null }
            ]
         },
         limit: data.limit,
         offset: data.offset,
         order: [
            ['created_at'],
         ],
      })
   },

   getAllProfilesChecked: async (data) => {
      return await db.User.findAll({
         where: { status: 1 },
         limit: data.limit,
         offset: data.offset,
         order: [
            ['created_at'],
         ],
      })
   },

   getAllCVProfiles: async () => {
      return await db.User.findAll({
         where: {
            [Op.or]: [
               { status: 0 },
               { status: null }
            ]
         },
      });
   },

   getAllCVChecked: async () => {
      return await db.User.findAll({
         where: {
            status: 1
         },
      });
   },

   updateAllCVLimit: async (data) => {
      return await db.User.findAll({
         where: {
            [Op.or]: [
               { status: 0 },
               { status: null }
            ]
         },
         limit: data.limit,
         offset: data.offset
      });
   },

   getLikeById: async (id) => {
      return await db.Interaction.findAll({
         where: {
            [Op.and]: [
               { sender_id: id },
               { action: 'liked' }
            ]
         }
      })
   },

   getReceivedLikeById: async (id) => {
      return await db.Interaction.findAll({
         where: {
            [Op.and]: [
               { receiver_id: id },
               { action: 'liked' }
            ]
         }
      })
   },

   uploadAvatar: async (id, data) => {
      return await db.User.update(data,
         {
            where: { id },
            returning: true,
            plain: true,
         }
      );
   },

   deletedUser: async (id) => {
      await db.User.destroy({
         where: {
            id: id
         }
      })
   },

   restoreUser: async (email) => {
      return await db.User.restore({
         where: {
            [Op.and]: [
               { email: email },
               { deleted_at: { [Op.not]: null } }
            ],
         },
      })
   },

   checkInviteCode: async (invite_code) => {
      return await db.User.findOne({
         where: {
            invite_code: invite_code
         }
      })
   }
}
