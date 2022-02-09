// Imports
var models = require("../models");
var asyncLib = require("async");
const Sequelize = require("sequelize");

// Routes
module.exports = {
  createConv: function (req, res) {
    //Params
    var userId1 = req.body.senderId;
    var userId2 = req.body.receiverId;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId2 },
          })
            .then(function (friendFound) {
              done(null, friendFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify friend" });
            });
        },
        function (friendFound, done) {
          if (friendFound) {
            models.User.findOne({
              where: { id: userId1 },
            })
              .then(function (userFound) {
                done(null, friendFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error });
          }
        },
        function (friendFound, userFound, done) {
          if (userFound) {
            models.Conversation.findOne({
              where: {
                userId1: userId1,
                userId2: userId2,
              },
            })
              .then(function (alreadyInConv) {
                done(null, friendFound, userFound, alreadyInConv);
              })
              .catch(function (err) {
                return res.status(500).json({
                  error:
                    "unable to verify if there is a conversation already on",
                });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (friendFound, userFound, alreadyInConv, done) {
          if (!alreadyInConv) {
            models.Conversation.create({
              userId1: userFound.id,
              userId2: friendFound.id,
            })
              .then(function (conversation) {
                done(conversation);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "création friendship impossible" });
              });
          } else {
            res.status(404).json({ error: "already friends" });
          }
        },
      ],
      function (conversation) {
        if (conversation) {
          return res.status(201).json("Conversation créée");
        } else {
          res.status(500).json({ error: "failed to create conversation" });
        }
      }
    );
  },
  getConv: function (req, res) {
    // Params
    var userId = req.params.userId;

    models.Conversation.findAll({
      where: { [Sequelize.Op.or]: [{ userId1: userId }, { userId2: userId }] },
      include: [
        {
          model: models.Message,
        },
      ],
      order: [[{ model: models.Message }, `id`, `ASC`]],
    })
      .then(function (conversation) {
        if (conversation) {
          res.status(201).json(conversation);
        } else {
          res.status(404).json({ error: "conversation not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch conversation" });
      });
  },
};
