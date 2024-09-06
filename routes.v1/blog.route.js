const express = require("express");
const { BlogController } = require("../controllers");
const { jwtService, imageService2 } = require("../services");

class BlogRouter {
  constructor(){
    this.router = express.Router();
    this.router.post("/listimage", jwtService.verifyAccessToken, imageService2.array("blogs"), BlogController.handleImages);
    this.router.post("/create", jwtService.verifyAccessToken, BlogController.createBlog);
    this.router.patch("/edit/:blogid", jwtService.verifyAccessToken, BlogController.editBlog);
    this.router.get("/get/:blogid", BlogController.getBlogById);
    this.router.get("/getallblogofuser/:userid", BlogController.getListBlog);
    this.router.post("/view/:blogid", BlogController.viewBlog);
    this.router.delete("/:blogid", jwtService.verifyAccessToken, BlogController.deleteBlog);
    this.router.post("/heart/:blogid", jwtService.verifyAccessToken, BlogController.heartBlog);
    this.router.post("/haha/:blogid", jwtService.verifyAccessToken, BlogController.hahaBlog);
    this.router.get("/comment/:blogid", BlogController.getCommentByBlogId);
    this.router.get("/heart/:blogid/:userid", BlogController.getUserStateForBlog);
  }
}

module.exports = BlogRouter;