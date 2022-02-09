// Imports
var express = require("express");

var usersCtrl = require("./routes/usersCtrl");
var postsCtrl = require("./routes/postCtrl");
var likesCtrl = require("./routes/likesCtrl");
var commentsCtrl = require("./routes/commentsCtrl");
var uploadCtrl = require("./routes/uploadCtrl");
const conversationsCtrl = require("./routes/conversationsCtrl");
const friendsCtrl = require("./routes/friendsCtrl");
const messagesCtrl = require("./routes/messagesCtrl");

// Router
exports.router = (function () {
  var apiRouter = express.Router();

  // Authentification
  apiRouter.post("/users/register/", usersCtrl.register);
  apiRouter.post("/users/login/", usersCtrl.login);
  apiRouter.get("/users/logout/", usersCtrl.logout);

  // Users routes
  apiRouter.get("/users/:id", usersCtrl.getUserProfile);
  apiRouter.put("/users/:id", usersCtrl.updateBio);
  apiRouter.get("/users/", usersCtrl.getAllUsers);
  apiRouter.delete("/users/:id", usersCtrl.deleteUser);

  // Friendship Route
  apiRouter.post("/users/follow/:id", friendsCtrl.follow);
  apiRouter.delete("/users/unfollow/:id", friendsCtrl.unfollow);
  apiRouter.get("/users/friends/:id", friendsCtrl.getFriends);

  // Upload Picture
  apiRouter.post(
    "/users/upload",
    uploadCtrl.uploadProfilPic,
    uploadCtrl.uploadProfilPicDB
  );

  // posts routes
  apiRouter.post("/posts/", postsCtrl.createPost);
  apiRouter.get("/posts/", postsCtrl.listPosts);
  apiRouter.delete("/posts/:postId", postsCtrl.deletePost);
  apiRouter.put("/posts/:postId", postsCtrl.updatePost);

  // Comments
  apiRouter.post("/posts/comment-post/:postId", commentsCtrl.editComment);
  apiRouter.put(
    "/posts/edit-comment-post/:commentId",
    commentsCtrl.updateComment
  );
  apiRouter.delete(
    "/posts/delete-comment-post/:commentId",
    commentsCtrl.deleteComment
  );

  // Likes
  apiRouter.post("/posts/like-post/:postId", likesCtrl.likePost);
  apiRouter.post("/posts/unlike-post/:postId", likesCtrl.dislikePost);

  // Conversations

  apiRouter.post("/conversations/", conversationsCtrl.createConv);
  apiRouter.get("/conversations/:userId", conversationsCtrl.getConv);

  // Messages on conversations
  apiRouter.post("/messages/:conversationId", messagesCtrl.editMessage);
  // apiRouter.get("/messages", messageRoute);

  return apiRouter;
})();
