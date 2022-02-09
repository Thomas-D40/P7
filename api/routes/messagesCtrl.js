// Imports
var models = require("../models");
var asyncLib = require("async");

// Routes
module.exports = {
  editMessage: function (req, res) {
    // Params
    var userId = req.body.userId;
    var conversationId = parseInt(req.params.conversationId);
    const content = req.body.content;

    if (conversationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    if (content == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.Conversation.findOne({
            where: { id: conversationId },
          })
            .then(function (convFound) {
              done(null, convFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify conv" });
            });
        },
        function (convFound, done) {
          if (convFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, convFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (userFound, convFound, done) {
          if (userFound && convFound) {
            models.Message.create({
              content: content,
              userId: userId,
              conversationId: conversationId,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "user or post not found" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          return res.status(201).json(newMessage);
        } else {
          return res.status(500).json({ error: "cannot post" });
        }
      }
    );
  },
};
