"use strict";
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Post",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    content: DataTypes.STRING,
  });
  Comment.associate = function (models) {
    // associations can be defined here

    models.User.belongsToMany(models.Post, {
      through: models.Comment,
      foreignKey: "userId",
      otherKey: "postId",
    });

    models.Post.belongsToMany(models.User, {
      through: models.Comment,
      foreignKey: "postId",
      otherKey: "userId",
    });

    models.Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    models.Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "post",
    });
  };
  return Comment;
};
