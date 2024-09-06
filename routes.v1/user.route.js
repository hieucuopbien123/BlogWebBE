const express = require("express");
const { UserController } = require("../controllers");
const { jwtService, imageService2 } = require("../services");

class UserRouter {
  constructor(){
    this.router = express.Router();
    this.router.get("/:id", UserController.getUserById);
    this.router.patch("/edit", jwtService.verifyAccessToken, imageService2.single("avatar"), UserController.editUserById);
    this.router.post("/changepassword", UserController.changePassword);
  }
}

module.exports = UserRouter;