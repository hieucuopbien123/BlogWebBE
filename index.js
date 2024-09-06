const Server = require("./server");
require("dotenv").config();
const fs = require("fs");

async function main() {
  const PORT = process.env.PORT || 3002;
  const server = new Server(PORT);
  server.start();
}

main();
