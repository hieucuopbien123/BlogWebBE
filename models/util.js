const dbConnection = require("../database");

class UtilModel {
  async deleteUtilByBlogId(blogid) {
    return await dbConnection.getDbConnection()
      .query(`DELETE FROM Util WHERE blogid=?;`, [blogid]);
  }
  async getUtilFromUserAndBlogId(blogid, userid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM Util WHERE blogid=? AND userid=?`, [blogid, userid]);
    return test;
  }
  async createUtilWithHaha(blogid, userId, haha){
    return await dbConnection.getDbConnection()
      .query(`INSERT INTO Util (blogid, userid, heart, haha) 
        VALUES(?, ?, 0, ?);`, [
          blogid, userId, haha
        ]);
  }
  async createUtilWithHeart(blogid, userId, heart){
    return await dbConnection.getDbConnection()
      .query(`INSERT INTO Util (blogid, userid, heart, haha) 
        VALUES(?, ?, ?, 0);`, [
          blogid, userId, heart
        ]);
  }
  async updateUtilWithHaha(blogid, userId, haha){
    return await dbConnection.getDbConnection()
      .query(`UPDATE Util SET 
        haha=?
        WHERE userid=? AND blogid=?;
      `, [
        haha, userId, blogid
      ]);
  }
  async updateUtilWithHeart(blogid, userId, heart){
    return await dbConnection.getDbConnection()
      .query(`UPDATE Util SET 
        heart=?
        WHERE userid=? AND blogid=?;
      `, [
        heart, userId, blogid
      ]);
  }
  async getTotalHahaOfBlog(blogid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT COUNT(1) FROM Util WHERE blogid=? AND haha=true;`, [
        blogid
      ]);
    return test;
  }
  async getTotalHeartOfBlog(blogid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT COUNT(1) FROM Util WHERE blogid=? AND heart=true;`, [blogid]);
    return test;
  }
}

module.exports = new UtilModel();
