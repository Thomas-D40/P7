"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      bio: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      picture: DataTypes.STRING,
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          models.User.hasMany(models.Post);
          models.User.hasMany(models.Friend);
          models.User.belongsToMany(User, {
            as: "friendId",
            through: "friends",
          });
        },
      },
    }
  );
  return User;
};
