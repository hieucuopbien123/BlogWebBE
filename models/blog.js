const createError = require("http-errors");
const dbConnection = require("../database");
const Utility = require("../helpers/utils");
const utilModel = require("./util");

class Blog {
  async createBlog(blogid, dataToCreate) {
    const updateDB = await dbConnection.getDbConnection()
      .query(`INSERT INTO Blog(blogid, category, title, userid, content, createdTime, heartNum, hahaNum, publishedAt, parentId, viewNum, meta) 
        VALUES(
          ? , 
          ? , 
          ? , 
          ? , 
          ? , 
          '${Utility.dateFromJsToMySQL(new Date())}',
          0 ,
          0 , 
          ? ,
          ? ,
          0,
          ?
        );
      `, [
        blogid,
        dataToCreate.category, 
        dataToCreate.title, 
        dataToCreate.userid, 
        dataToCreate.content,
        dataToCreate.publishedAt ? Utility.dateFromJsToMySQL(new Date()): null,
        dataToCreate.parentId != null ? dataToCreate.parentId : null,
        dataToCreate.meta
      ]);
    return updateDB;
  }
  async getBlogById(id){
    const [test] = await dbConnection.getDbConnection()
        .query(`SELECT * FROM Blog WHERE blogid = ?`, [id]);
      if(test.length <= 0) {
        throw createError.BadRequest("Blog not exist");
      }
    return test[0];
  }
  async getBlogByUserIdAndBlogId(blogid, userid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT * FROM Blog WHERE blogid=? AND userid=?`,
      [blogid, userid]);
    if(test.length <= 0) {
      throw createError.BadRequest("Blog not exist");
    }
    return test[0];
  }
  async updateBlogByUserAndBlogId(dataToUpdate, userid, blogid){
    return await dbConnection.getDbConnection()
      .query(`UPDATE Blog SET
        category=?,
        title=?,
        content=?,
        publishedAt=?,
        lastModifiedAt='${Utility.dateFromJsToMySQL(new Date())}',
        parentId=?,
        meta=?
        WHERE userid=? AND blogid=?;
      `, [
        dataToUpdate.category,
        dataToUpdate.title,
        dataToUpdate.content,
        dataToUpdate.publishedAt ? Utility.dateFromJsToMySQL(new Date()): null,
        dataToUpdate.parentId == null ? null : dataToUpdate.parentId,
        dataToUpdate.meta,
        userid,
        blogid
      ]);
  }
  async increaseViewById(viewNum, blogid){
    return await dbConnection.getDbConnection()
      .query(`UPDATE Blog SET
        viewNum=?
        WHERE blogid=?;
      `, [viewNum, blogid]);
  }
  async getListBlogByUserId(userid){
    const [test] = await dbConnection.getDbConnection()
      .query(`SELECT blogid, category, title, userid, createdTime, heartNum, hahaNum, publishedAt, viewNum, meta FROM Blog WHERE userid=?`, [userid]);
    return test;
  }
  async deleteBlogById(blogid, userId){
    const [test] = await dbConnection.getDbConnection()
      .query(`DELETE FROM Blog WHERE blogid=? AND userid=?;`, [blogid, userId]);
    return test;
  }
  async updateHeartOfBlog(blogid){
    const test = await utilModel.getTotalHeartOfBlog(blogid);
    return await dbConnection.getDbConnection()
      .query(`UPDATE Blog SET
        heartNum=?
        WHERE blogid=?;`,[
          test[0]["COUNT(1)"], blogid
        ]
      );
  }
  async updateHahaOfBlog(blogid){
    const test = await utilModel.getTotalHahaOfBlog(blogid);
    return await dbConnection.getDbConnection()
      .query(`UPDATE Blog SET
        hahaNum=?
        WHERE blogid=?;`,[
          test[0]["COUNT(1)"],
          blogid
        ]
      );
  }
}

module.exports = new Blog();