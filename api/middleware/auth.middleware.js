// Imports
var models = require("../models");
const jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "<JWT_SIGN_TOKEN>";

// Exported functions
module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: "3h",
      }
    );
  },
};

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        // res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await models.User.findOne({
          attributes: ["id"],
          where: { id: decodedToken.userId },
        });
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.sendStatus(200).json("no token available");
      } else {
        console.log(decodedToken.userId);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
