// Imports
var models = require("../models");
var asyncLib = require("async");

// Constants
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createPost: function (req, res) {
    // Params

    const userId = req.body.user;

    const content = req.body.content;

    const video = req.body.video;

    if (content == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Post.create({
              content: content,
              attachment: video,
              UserId: userFound.id,
            }).then(function (newPost) {
              done(newPost);
            });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (newPost) {
        if (newPost) {
          return res.status(201).json(newPost);
        } else {
          return res.status(500).json({ error: "cannot post" });
        }
      }
    );
  },
  listPosts: function (req, res) {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Post.findAll({
      order: [order != null ? order.split(":") : ["id", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["username"],
        },
        {
          model: models.Comment,
          attributes: ["id", "postId", "userId", "content", "updatedAt"],
        },
        {
          model: models.Like,
        },
      ],
    })
      .then(function (posts) {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ error: "no posts found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },
  updatePost: function (req, res) {
    // Params
    var postId = parseInt(req.params.postId);
    var content = req.body.content;

    asyncLib.waterfall(
      [
        function (done) {
          models.Post.findOne({
            attributes: ["id", "content"],
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
            postFound
              .update({
                content: content ? content : postFound.content,
              })
              .then(function () {
                done(postFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "cannot update post" });
              });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (postFound) {
        if (postFound) {
          return res.status(201).json(postFound);
        } else {
          return res.status(500).json({ error: "failed to update post" });
        }
      }
    );
  },
  deletePost: function (req, res) {
    // Params
    var postId = parseInt(req.params.postId);

    models.Post.findOne({
      where: { id: postId },
    })
      .then(function (postFound) {
        if (postFound) {
          postFound
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
