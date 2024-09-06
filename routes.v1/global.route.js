const express = require("express");
const { GlobalController } = require("../controllers");

class GlobalRoute {
  constructor(){
    this.router = express.Router();
    this.router.get("/search", GlobalController.search);
  }
}

module.exports = GlobalRoute;