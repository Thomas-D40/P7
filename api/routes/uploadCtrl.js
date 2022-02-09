// Imports
var models = require("../models");
var asyncLib = require("async");
const fs = require("fs");

// image Upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/profil");
  },
  filename: (req, file, cb) => {
    const name = req.body.name;
    cb(null, name + path.extname(file.originalname));
  },
});

const uploadProfilPic = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("file");

const uploadProfilPicDB = async (req, res) => {
  var fileName = req.body.name + ".jpg";

  // Params
  var userId = req.body.userId;

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          attributes: ["id", "picture"],
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
        console.log(fileName);
        if (userFound) {
          userFound
            .update({
              picture: fileName
                ? "./uploads/profil/" + fileName
                : userFound.picture,
            })
            .then(function () {
              done(userFound);
            })
            .catch(function (err) {
              res.status(500).json({ error: "cannot update user" });
            });
        } else {
          res.status(404).json({ error: "user not found" });
        }
      },
    ],
    function (userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ error: "cannot update user profile" });
      }
    }
  );
};

module.exports = {
  uploadProfilPic,
  uploadProfilPicDB,
};
