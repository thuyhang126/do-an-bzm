"use strict";

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      poster_id: DataTypes.INTEGER,
      category: DataTypes.STRING,
      title: DataTypes.TEXT,
      images: {
        type: DataTypes.TEXT,
        set(value) {
          this.setDataValue("images", JSON.stringify(value));
        },
      },
      created_at: "TIMESTAMP",
      updated_at: "TIMESTAMP",
      deleted_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      paranoid: true,
      tableName: "posts",
      deletedAt: "deleted_at",
    }
  );

  Post.associate = (models) => {
    Post.hasMany(models.Like, {
      as: "likes",
      foreignKey: "post_id",
      timestamps: false,
    });

    Post.hasMany(models.Comment, {
      as: "comments",
      foreignKey: "post_id",
      timestamps: false,
    });

    Post.belongsTo(models.User, {
      as: "user",
      foreignKey: "poster_id",
      timestamps: false,
    });
  };

  return Post;
};
