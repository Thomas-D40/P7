// Imports
var models = require("../models");
var asyncLib = require("async");

// Constants
const DISLIKED = 0;
const LIKED = 1;

// Routes
module.exports = {
  likePost: function (req, res) {
    // Params
    var userId = req.body.id;
    var postId = parseInt(req.params.postId);

    if (postId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.Post.findOne({
            where: { id: postId },
          })
            .then(function (postFound) {
              done(null, postFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify post" });
            });
        },
        function (postFound, done) {
          if (postFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, postFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (postFound, userFound, done) {
          if (userFound) {
            models.Like.findOne({
              where: {
                userId: userId,
                postId: postId,
              },
            })
              .then(function (userAlreadyLikedFound) {
                done(null, postFound, userFound, userAlreadyLikedFound);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "unable to verify is user already liked" });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (postFound, userFound, userAlreadyLikedFound, done) {
          if (!userAlreadyLikedFound) {
            models.Like.create({
              userId: userFound.id,
              postId: postFound.id,
              isLike: LIKED,
            })
              .then(function (userAlreadyLikedFound) {
                done(null, postFound, userFound);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "création ligne like impossible" });
              });
          } else {
            if (userAlreadyLikedFound.isLike === DISLIKED) {
              userAlreadyLikedFound
                .update({
                  isLike: LIKED,
                })
                .then(function () {
                  done(null, postFound, userFound);
                })
                .catch(function (err) {
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
            } else {
              res.status(409).json({ error: "post already liked" });
            }
          }
        },
        function (postFound, userFound, done) {
          postFound
            .update({
              likes: postFound.likes + 1,
            })
            .then(function () {
              done(postFound);
            })
            .catch(function (err) {
              res
                .status(500)
                .json({ error: "cannot update post like counter" });
            });
        },
      ],
      function (postFound) {
        if (postFound) {
          return res.status(201).json(postFound);
        } else {
          res.status(500).json({ error: "failed to like" });
        }
      }
    );
  },
  dislikePost: function (req, res) {
    // Params
    var userId = req.body.id;
    var postId = parseInt(req.params.postId);

    if (postId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.Post.findOne({
            where: { id: postId },
          })
            .then(function (postFound) {
              done(null, postFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify post" });
            });
        },
        function (postFound, done) {
          if (postFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, postFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (postFound, userFound, done) {
          if (userFound) {
            models.Like.findOne({
              where: {
                userId: userId,
                postId: postId,
              },
            })
              .then(function (userAlreadyLikedFound) {
                done(null, postFound, userFound, userAlreadyLikedFound);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "unable to verify is user already liked" });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (postFound, userFound, userAlreadyLikedFound, done) {
          if (!userAlreadyLikedFound) {
            postFound
              .addUser(userFound, { isLike: DISLIKED })
              .then(function (alreadyLikeFound) {
                done(null, postFound, userFound);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "unable to set user reaction" });
              });
          } else {
            if (userAlreadyLikedFound.isLike === LIKED) {
              userAlreadyLikedFound
                .update({
                  isLike: DISLIKED,
                })
                .then(function () {
                  done(null, postFound, userFound);
                })
                .catch(function (err) {
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
            } else {
              res.status(409).json({ error: "post already disliked" });
            }
          }
        },
        function (postFound, userFound, done) {
          postFound
            .update({
              likes: postFound.likes - 1,
            })
            .then(function () {
              done(postFound);
            })
            .catch(function (err) {
              res
                .status(500)
                .json({ error: "cannot update post like counter" });
            });
        },
      ],
      function (postFound) {
        if (postFound) {
          return res.status(201).json(postFound);
        } else {
          return res.status(500).json({ error: "failed to like" });
        }
      }
    );
  },
};
