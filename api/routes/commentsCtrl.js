// Imports
var models = require("../models");
var asyncLib = require("async");

// Routes
module.exports = {
  editComment: function (req, res) {
    // Params
    var userId = req.body.userId;
    var postId = parseInt(req.params.postId);
    const content = req.body.content;

    if (postId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    if (content == null) {
      return res.status(400).json({ error: "missing parameters" });
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
        function (userFound, postFound, done) {
          if (userFound && postFound) {
            models.Comment.create({
              content: content,
              userId: userId,
              postId: postId,
            }).then(function (newComment) {
              done(newComment);
            });
          } else {
            res.status(404).json({ error: "user or post not found" });
          }
        },
      ],
      function (newComment) {
        console.log(newComment);
        if (newComment) {
          return res.status(201).json(newComment);
        } else {
          return res.status(500).json({ error: "cannot post" });
        }
      }
    );
  },
  updateComment: function (req, res) {
    // Params
    var commentId = parseInt(req.params.commentId);
    var content = req.body.content;
    console.log(commentId);

    asyncLib.waterfall(
      [
        function (done) {
          models.Comment.findOne({
            where: { id: commentId },
          })
            .then(function (commentFound) {
              console.log(commentFound);
              done(null, commentFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify comment" });
            });
        },
        function (commentFound, done) {
          if (commentFound) {
            commentFound
              .update({
                content: content ? content : commentFound.content,
              })
              .then(function () {
                done(commentFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "cannot update post" });
              });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (commentFound) {
        if (commentFound) {
          return res.status(201).json(commentFound);
        } else {
          return res.status(500).json({ error: "cannot update post" });
        }
      }
    );
  },
  deleteComment: function (req, res) {
    // Params
    var commentId = parseInt(req.params.commentId);

    models.Comment.findOne({
      where: { id: commentId },
    })
      .then(function (commentFound) {
        if (commentFound) {
          commentFound
            .destroy()
            .then(function () {
              return res.status(200).json();
            })
            .catch(() => {
              return res.status(500).json({ error: "cannot delete" });
            });
        }
      })
      .catch(function (err) {
        return res.status(500).json({ error: "unable to verify post" });
      });
  },
};
