"use strict";
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Conversation",
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
    },
    {}
  );
  Message.associate = function (models) {
    // associations can be defined here

    models.User.belongsToMany(models.Conversation, {
      through: models.Message,
      foreignKey: "userId",
      otherKey: "conversationId",
    });

    models.Conversation.belongsToMany(models.User, {
      through: models.Message,
      foreignKey: "conversationId",
      otherKey: "userId",
    });

    models.Message.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    models.Message.belongsTo(models.Conversation, {
      foreignKey: "conversationId",
      as: "conversation",
    });
  };
  return Message;
};
