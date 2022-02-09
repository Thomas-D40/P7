// Imports
var models = require("../models");
var asyncLib = require("async");

// Routes
module.exports = {
  follow: function (req, res) {
    // Params
    var userId = req.body.userId;
    var friendId = parseInt(req.params.id);

    if (friendId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: friendId },
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
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, friendFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "already friend" });
          }
        },
        function (friendFound, userFound, done) {
          if (userFound) {
            models.Friend.findOne({
              where: {
                userId: userId,
                friendId: friendId,
              },
            })
              .then(function (alreadyFriend) {
                done(null, friendFound, userFound, alreadyFriend);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "unable to verify if already friend" });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (friendFound, userFound, alreadyFriend, done) {
          if (!alreadyFriend) {
            models.Friend.create({
              userId: userFound.id,
              friendId: friendFound.id,
            })
              .then(function (friendship) {
                done(friendship);
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
      function (friendship) {
        if (friendship) {
          return res.status(201).json("Ajout effectué");
        } else {
          res.status(500).json({ error: "failed to add friend" });
        }
      }
    );
  },
  unfollow: function (req, res) {
    //Params
    var userId = req.body.userId;
    var friendId = parseInt(req.params.id);

    if (friendId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    models.Friend.findOne({
      where: {
        friendId: friendId,
        userId: userId,
      },
    })
      .then(function (friendShip) {
        if (friendShip) {
          console.log(friendShip);
          friendShip
            .destroy()
            .then(function () {
              return res.status(200).json("Suppression effectuée");
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
  getFriends: function (req, res) {
    // Params
    var userId = req.params.id;

    models.Friend.findAll({
      attributes: ["friendId"],
      where: { userId: userId },
    })
      .then(function (friends) {
        if (friends) {
          res.status(200).json(friends);
        } else {
          res.status(404).json({ error: "no friends in DB" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },
};
