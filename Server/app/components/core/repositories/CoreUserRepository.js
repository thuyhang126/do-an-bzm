"use strict";

const User = require("@models").User;
const db = require("@models");
const { Op } = require("sequelize");
const uuid = require("uuid");

const UserRepository = {
  getAllUser: async () => {
    let allUser = await User.findAll({ raw: true });
    return allUser;
  },

  getAllUserOnline: async () => {
    let allUser = await User.findAll({
      where: {
        state: "online",
      },
    });
    return allUser;
  },

  getUserByEmail: async (email) => {
    return await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: db.Role,
          as: "roles",
        },
      ],
    });
  },

  getUserById: async (id) => {
    return await User.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password"] },
    });
  },

  findByIdWithRaw: async (id) => {
    return await User.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.Role,
          as: "roles",
        },
      ],
    });
  },

  create: async (user) => {
    return (user = await User.create(user));
  },

  updateUser: async (userId, data) => {
    await db.User.update(
      {
        avatar: data.avatar,
        card_visit: data.card_visit,
        name: data.data.name,
        social_id: data.data.social_id,
        birthday: data.data.birthday,
        public: data.data.public,
        purpose: data.data.purpose,
        invite_code: data.data.invite_code,
        register_code: data.data.register_code,
        company: data.data.company,
        position: data.data.position,
        business_model: data.data.business_model,
        descriptions: data.data.descriptions,
        state: data.data.state,
      },
      {
        where: { id: userId },
        returning: true,
        plain: true,
      }
    );

    return await UserRepository.getUserById(userId);
  },

  //Duyet CV
  updateCV: async (data) => {
    await db.User.update(
      {
        status: 1,
        invite_code: uuid.v1().slice(0, 8),
        register_code: data.register_code,
      },
      { where: { email: data.email } }
    );

    return await UserRepository.getUserByEmail(data.email);
  },

  //Duyet CV admin
  updateStatus: async (email) => {
    await db.User.update(
      { status: 1, invite_code: uuid.v1().slice(0, 8) },
      { where: { email: email } }
    );

    return await UserRepository.getUserByEmail(email);
  },

  //hủy Duyet CV
  quitUpdateCV: async (email) => {
    await db.User.update({ status: 0 }, { where: { email: email } });

    return await UserRepository.getUserByEmail(email);
  },

  updateAllCV: async (arrayEmail) => {
    await db.User.update({ status: 1 }, { where: { email: arrayEmail } });
  },

  //get 1 list user voi where: 1 array
  getUsersWhereArray: async (array) => {
    return await User.findAll({
      where: { id: array },

      attributes: { exclude: ["password"] },
    });
  },

  getUsersDestroy: async (email) => {
    return await User.findOne({
      where: {
        [Op.and]: [{ email: email }, { deleted_at: { [Op.not]: null } }],
      },
      paranoid: false,
    });
  },

  getUserDestroyByiId: async (id) => {
    return await User.findOne({
      where: {
        [Op.and]: [{ id: id }, { deleted_at: { [Op.not]: null } }],
      },
      paranoid: false,
    });
  },

  getAllUserDestroyByiId: async (arryId) => {
    return await User.findAll({
      where: {
        deleted_at: { [Op.not]: null },
      },
      paranoid: false,
      attributes: ['id']
    });
  },

  getUserOffline: async () => {
    return await User.findAll({
      where: { state: "offline" },

      attributes: ["id"],
    });
  },
};

module.exports = UserRepository;
