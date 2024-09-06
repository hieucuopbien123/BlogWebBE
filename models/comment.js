const dbConnection = require("../database");
const createError = require("http-errors");
const Utility = require("../helpers/utils");

class CommentModel {
  async deleteCommentByBlogId(blogid){
    return await dbConnection.getDbConnection()
      .query(`DELETE FROM Comment WHERE blogid=?;`, [blogid]);
  }
  async deleteCommentById(commentid, userId){
    const [test1] = await dbConnection.getDbConnection()
      .query(`DELETE FROM Comment WHERE id=? AND userid=?;`, [
        commentid, userId
      ]);
    return test1;
  }
  async getCommentByBlogId(blogid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM Comment WHERE blogid=?;`, [blogid]);
    return test;
  }
  async getCommentById(id){
    const [test2] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM Comment WHERE id=?`, [id]);
    if(test2.length <= 0) {
      throw createError.BadRequest("Comment not exist");
    }
    return test2[0];
  }
  async getCommentByUserAndCommentId(userId, commentid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM Comment WHERE id=? AND userid=?;`, [
        commentid, userId
      ]);
    if(test.length <= 0) {
      throw createError.BadRequest("Comment not exist");
    }
    return test[0];
  }
  async createComment(commentid, content, userId, blogid, parentid){
    return await dbConnection.getDbConnection()
      .query(`INSERT INTO Comment (id, content, createdTime, userid, blogid, parentid) 
        VALUES(
          ?,
          ?, 
          '${Utility.dateFromJsToMySQL(new Date())}',
          ?,
          ?,
          ?
        );`, [
          commentid, content, userId, blogid, parentid
        ]);
  }
  async updateCommentByUserAndCommentId(content, userId, commentid){
    return await dbConnection.getDbConnection()
      .query(`UPDATE Comment SET 
        content=?,
        lastModifiedAt='${Utility.dateFromJsToMySQL(new Date())}'
        WHERE userid=? AND id=?;
      `, [
        content, userId, commentid
      ]);
  }
}

module.exports = new CommentModel();
