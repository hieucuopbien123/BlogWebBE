// Dùng mysql2
// Cấu trúc dự án nodejs express server / Dùng chuẩn OOP

// Giải quyết vấn đề của best practice => của "NodeJS Final.txt"

// // Dùng ok
// require("dotenv").config();
// const mysql = require('mysql2/promise');
// class DatabaseConnection {
//   static async connect() {
//     try{
//       return await mysql.createConnection({
//         host: process.env.MYSQL_HOST,
//         user: process.env.MYSQL_USERNAME,
//         password: process.env.MYSQL_PASSWORD,
//         database: process.env.MYSQL_DB,
//       });
//     } catch(err){
//       throw "Error connect db: " + err;
//     }
//   }
// }
// let dbConnectionInstance = null;
// const initConnection = async () => {
//   dbConnectionInstance = await DatabaseConnection.connect();
//   console.log("Finish connected");
//   const [test, fields] = await dbConnectionInstance.query("SELECT * FROM Test");
//   console.log(test);
// }
// initConnection();
// const dbConnection = () => {
//   return dbConnectionInstance;
// }
// module.exports = dbConnection; // Dùng với dbConnection()


// // Dùng sai
// require("dotenv").config();
// const mysql = require('mysql2/promise');
// class DatabaseConnection {
//   static async connect() {
//     try{
//       return await mysql.createConnection({
//         host: process.env.MYSQL_HOST,
//         user: process.env.MYSQL_USERNAME,
//         password: process.env.MYSQL_PASSWORD,
//         database: process.env.MYSQL_DB,
//       });
//     } catch(err){
//       throw "Error connect db: " + err;
//     }
//   }
// }
// let dbConnectionInstance = null;
// const initConnection = async () => {
//   dbConnectionInstance = await DatabaseConnection.connect();
//   console.log("Finish connected");
//   const [test, fields] = await dbConnectionInstance.query("SELECT * FROM Test");
//   console.log(test);
// }
// initConnection();
// module.exports = dbConnectionInstance;


// Dùng ok => tối ưu
require("dotenv").config();
const mysql = require('mysql2/promise');
class DatabaseConnection {
  #dbConnectionInstance = null;
  constructor() {
    this.connect();
  }
  async connect() {
    try{
      this.#dbConnectionInstance = await mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        connectionLimit: 10,
      });
      const [test, fields] = await this.#dbConnectionInstance.query("SELECT * FROM Test");
      console.log("ConnnectDb success::", test);
    } catch(err){
      throw "Error connect db: " + err;
    }
  }
  getDbConnection() {
    return this.#dbConnectionInstance;
  }
}
let dbConnection = new DatabaseConnection();
module.exports = dbConnection; // Dùng với dbConnection.getDbConnection()


// Dùng sai
// require("dotenv").config();
// const mysql = require('mysql2/promise');
// class DatabaseConnection {
//   #dbConnectionInstance = null;
//   constructor() {
//     this.connect();
//   }
//   async connect() {
//     try{
//       this.#dbConnectionInstance = await mysql.createConnection({
//         host: process.env.MYSQL_HOST,
//         user: process.env.MYSQL_USERNAME,
//         password: process.env.MYSQL_PASSWORD,
//         database: process.env.MYSQL_DB,
//       });
//       const [test, fields] = await this.#dbConnectionInstance.query("SELECT * FROM Test");
//       console.log(test);
//     } catch(err){
//       throw "Error connect db: " + err;
//     }
//   }
//   getDbConnection() {
//     return this.#dbConnectionInstance;
//   }
// }
// let dbConnection = new DatabaseConnection();
// module.exports = dbConnection.getDbConnection;
