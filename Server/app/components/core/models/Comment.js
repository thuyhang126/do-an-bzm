"use strict";

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      commenter_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      belong: DataTypes.INTEGER,
      likes: {
        type: DataTypes.TEXT,
        set(value) {
          this.setDataValue("likes", JSON.stringify(value));
        },
        get() {
          return JSON.parse(this.getDataValue("likes"));
        },
      },
      rank: DataTypes.INTEGER,
      created_at: "TIMESTAMP",
      updated_at: "TIMESTAMP",
      deleted_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      paranoid: true,
      tableName: "comments",
      deletedAt: "deleted_at",
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      as: "user",
      foreignKey: "commenter_id",
      timestamps: false,
    });

    Comment.belongsTo(models.Post, {
      as: "post",
      foreignKey: "post_id",
      timestamps: false,
    });
  };

  return Comment;
};
