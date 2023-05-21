'use strict';

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    liker_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    created_at: 'TIMESTAMP',
    updated_at: 'TIMESTAMP',
    deleted_at: DataTypes.DATE,
  }, {
    timestamps: false,
    paranoid: true,
    tableName: 'likes',
    deletedAt: 'deleted_at',
  });

  Like.associate = models => {
    Like.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'liker_id',
      timestamps: false,
    });

    Like.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'post_id',
      timestamps: false,
    });
  };

  return Like;
};
