'use strict';

const appConfig = require("@config/app");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      get() {
        let rawValue = this.getDataValue('avatar');
        if (rawValue && !rawValue.startsWith('http')) {
          rawValue = appConfig.apiApp + rawValue;
        };
        return rawValue;
      }
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    social_id: DataTypes.STRING,
    provider: DataTypes.STRING,
    birthday: DataTypes.DATE,
    public: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    purpose: DataTypes.STRING,
    descriptions: DataTypes.STRING,
    invite_code: DataTypes.STRING,
    register_code: DataTypes.STRING,
    company: DataTypes.STRING,
    position: DataTypes.STRING,
    card_visit: {
      type: DataTypes.STRING,
      get() {
        let rawValue = this.getDataValue('card_visit');
        if (rawValue && !rawValue.startsWith('http')) {
          rawValue = appConfig.apiApp + rawValue;
        };
        return rawValue;
      }
    },
    business_model: DataTypes.STRING,
    state: DataTypes.STRING,
    created_at: 'TIMESTAMP',
    updated_at: 'TIMESTAMP',
    deleted_at: DataTypes.DATE,
  }, {
    tableName: 'users',
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  User.associate = models => {
    User.hasMany(models.Match, {
      as: 'matches',
      foreignKey: 'object_id',
      timestamps: false,
    });

    User.hasMany(models.Interaction, {
      as: 'interactions',
      foreignKey: 'sender_id',
      timestamps: false,
    });

    User.hasMany(models.Message, {
      as: 'messages',
      foreignKey: 'sender_id',
      timestamps: false,
    });

    User.hasMany(models.Post, {
      as: 'posts',
      foreignKey: 'poster_id',
      timestamps: false,
    });

    User.hasMany(models.Like, {
      as: 'likes',
      foreignKey: 'liker_id',
      timestamps: false,
    });

    User.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'commenter_id',
      timestamps: false,
    });

    User.belongsToMany(models.Role, {
      as: 'roles',
      through: 'role_user',
      foreignKey: 'user_id',
      otherKey: 'role_id',
      timestamps: false
    });
  };

  return User;
};
