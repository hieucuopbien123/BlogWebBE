const express = require("express");
const { CommentController } = require("../controllers");
const { jwtService } = require("../services");

class BlogRouter {
  constructor(){
    this.router = express.Router();
    this.router.post("/:blogid", jwtService.verifyAccessToken, CommentController.createComment);
    this.router.patch("/:commentid", jwtService.verifyAccessToken, CommentController.editComment);
    this.router.delete("/:commentUser/:commentid", jwtService.verifyAccessToken, CommentController.deleteComment);
    this.router.get("/:commentid", CommentController.getCommentById);
  }
}

module.exports = BlogRouter;