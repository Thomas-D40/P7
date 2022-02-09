"use strict";
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define("Post", {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
  });
  Post.associate = function (models) {
    // associations can be defined here

    models.Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });

    models.Post.hasMany(models.Comment);

    models.Post.hasMany(models.Like);
  };

  return Post;
};
