const dbConnection = require("../database");
const createError = require("http-errors");
const Utility = require("../helpers/utils");

class UserModel {
  async getUserById(id) {
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM BlogUser WHERE id=?`, [id]);
    if(test.length <= 0) {
      throw createError.BadRequest("User not exist");
    }
    return test[0];
  }
  async getUserByEmail(email) {
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM BlogUser WHERE email=?`, [email]);
    if(test.length <= 0) {
      throw createError.BadRequest("User not exist");
    }
    return test[0];
  }
  async updateUserById(dataToUpdate, userId){
    const [test] = await dbConnection.getDbConnection()
      .query(`UPDATE BlogUser SET 
              avatar=?,
              dateofbirth=?,
              gender=?,
              displayname=?,
              bio=?
              WHERE id=?`,[
                dataToUpdate.avatar,
                Utility.dateFromJsToMySQL(dataToUpdate.dateofbirth),
                dataToUpdate.gender,
                dataToUpdate.displayname,
                dataToUpdate.bio,
                userId
              ]
      );
    return test;
  }
  async changePasswordById(hashedPassword, userId){
    const [test] = await dbConnection.getDbConnection()
      .query(`UPDATE BlogUser SET 
              password=?
              WHERE id=?`, [
                hashedPassword,
                userId
              ]
      );
    return test;
  }
  async getUserByEmailOrUsername(username, email){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM BlogUser WHERE username=? OR email=?`, [
        username,
        email
      ]);
    if(test.length > 0) {
      throw createError.Conflict("Username or email has already been used");
    }
    return test[0];
  }
  async getUserByUsername(username){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM BlogUser WHERE username=?`, [username]);
    if(test.length <= 0) {
      throw createError.BadRequest("Username not exist");
    }
    return test[0];
  }
  async createNewUser(idUser, username, hashedPassword, email, displayname) {
    return await dbConnection.getDbConnection()
    .query(`INSERT INTO BlogUser (id, username, password, email, displayname, emailverified) 
      VALUES(?, ?, ?, ?, ?, 0);`, [
        idUser, username, hashedPassword, email, displayname
      ]);
  }
  async verifyMailById(id){
    const [test] = await dbConnection.getDbConnection()
      .query(`UPDATE BlogUser SET emailverified=1 WHERE id=?`, [id]);
    return test;
  }
}

module.exports = new UserModel();