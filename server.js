const express = require("express");
const createError = require("http-errors");
const dbConnection = require("./database");
const path = require("path");
const MainRouter = require("./routes.v1");
const { imageService2 } = require("./services");
const cors = require("cors");
const SocketContext = require("./socketcontext");

// Dùng socket.io
// Cấu trúc dự án nodejs express server 

class Server {
  #app; 
  #port;
  #io;
  #http;
  static connectedSockets = [];
  constructor(port) {
    this.#port = port;
    this.#app = express();
    this.#http = require('http').createServer(this.#app);
    this.#io = require('socket.io')(this.#http, {
      cors: { // Phải có cái này tránh lỗi socket core
        // origin: ["http://localhost:3000", "https://hostnodejs-388808.uw.r.appspot.com"],
        origin: "*",
      }
    });
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cors());
    this.#app.use("/tmp", express.static(path.join(__dirname, "../tmp")));
    this.#configureRoutes();
    this.#setupSocket();
  }
  #setupSocket() {
    this.#io.on("connection", (socket) => {
      // Ở đây dùng arrow function thì biến this trong này sẽ là của class
      console.log("New user connected");
      SocketContext.connectedSockets.push(socket);
      socket.on("login", (userId) => {
        socket.userId = userId;
        console.log(`User ${userId} logged in`);
      });
      socket.on("disconnect", () => {
        const socketIndex = SocketContext.connectedSockets.indexOf(socket);
        if (socketIndex !== -1) {
          console.log(`An user ${SocketContext.connectedSockets[socketIndex].userId} disconnected`);
          SocketContext.connectedSockets.splice(socketIndex, 1);
        }
      });
    });
  }
  #configureRoutes() {
    this.#app.get("/", async (req, res, next) => {
      const [test, fields] = await dbConnection.getDbConnection().query("SELECT * FROM Test");
      res.json(test);
    });
    this.#app.post("/test2", imageService2.array("blogs"), async (req, res, next) => {
      const { body, files } = req;
      console.log("File::", files);
      res.send("HomePage2");
    });
    this.#app.use("/api/v1", new MainRouter().router);
    this.#handleError();
  }
  #handleError() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("This route doesn't exist"));
    })
    this.#app.use((err, req, res, next) => {
      console.log(JSON.stringify(err));
      res.json({
        status: err.status || 500,
        message: err.message
      })
    });
  }
  start() {
    this.#http.listen(this.#port, () => {
      console.log(`Server is running on ${this.#port}`);
    });
  }
}

module.exports = Server;
