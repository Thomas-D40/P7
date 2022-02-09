// Imports
var express = require("express");
var bodyParser = require("body-parser");
var apiRouter = require("./apiRouter").router;
var cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");
const path = require("path");

// Instantiate server
var server = express();

// CORS Config

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
server.use(cors(corsOptions));

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());

// jwt
server.get("*", checkUser);
server.get("/jwtid", requireAuth, (req, res) => {
  res.json(res.locals.user.id);
});

// Configure routes

server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Bonjour sur mon super server</h1>");
});

server.use("/api/", apiRouter);
server.use(
  "/uploads/profil",
  express.static(path.join(__dirname, "/uploads/profil"))
);

// Launch server
server.listen(5000, function () {
  console.log("Server en écoute sur le port 5000 :)");
});
