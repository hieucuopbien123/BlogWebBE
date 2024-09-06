const UserRouter = require("./user.route");
const AuthRouter = require("./auth.route");
const BlogRouter = require("./blog.route");
const CommentRouter = require("./comment.route");
const GlobalRouter = require("./global.route");
const express = require("express");

class MainRouter {
  constructor(){
    this.router = express.Router();
    const userRoute = new UserRouter().router;
    const authRoute = new AuthRouter().router;
    const blogRoute = new BlogRouter().router;
    const commentRoute = new CommentRouter().router;
    const globalRoute = new GlobalRouter().router;
    const routes = [
      {
        path: "/user",
        route: userRoute
      },
      {
        path: "/auth",
        route: authRoute
      },
      {
        path: "/blog",
        route: blogRoute
      },
      {
        path: "/comment",
        route: commentRoute
      },
      {
        path: "/",
        route: globalRoute
      }
    ];
    routes.forEach(route => {
      this.router.use(route.path, route.route);
    })
  }
}

module.exports = MainRouter;