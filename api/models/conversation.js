"use strict";
module.exports = (sequelize, DataTypes) => {
  var Conversation = sequelize.define("Conversation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    userId1: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    userId2: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
  });
  Conversation.associate = function (models) {
    // associations can be defined here

    models.User.belongsToMany(models.User, {
      through: models.Conversation,
      as: "userId",
      foreignKey: "userId2",
      otherKey: "userId1",
    });

    models.Conversation.hasMany(models.Message);
  };
  return Conversation;
};
