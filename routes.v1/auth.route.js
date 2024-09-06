const express = require("express");
const { AuthController } = require("../controllers");

class AuthRouter {
  constructor() {
    this.router = express.Router();
    this.router.post("/signup", AuthController.signup);
    this.router.post("/verifySignup/:slug", AuthController.verifySignup);
    this.router.post("/signin", AuthController.signin);
    this.router.post("/signinwithgmail", AuthController.signinwithgmail);
  }
}

module.exports = AuthRouter;