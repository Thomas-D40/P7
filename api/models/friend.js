"use strict";
module.exports = (sequelize, DataTypes) => {
  var Friend = sequelize.define("Friend", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    friendId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
  });
  Friend.associate = function (models) {
    // associations can be defined here

    models.User.belongsToMany(models.User, {
      through: models.Friend,
      as: "friendId",
      foreignKey: "userId",
      otherKey: "userId",
    });
  };
  return Friend;
};
