const createError = require("http-errors");
const { v4: uuidv4 } = require('uuid');
const ValidationHelper = require("../helpers/validation");
const SocketContext = require("../socketcontext");
const userModel = require("../models/bloguser");
const blogModel = require("../models/blog");
const commentModel = require("../models/comment");

class CommentController {
  static async createComment(req, res, next) {
    try{
      const { blogid } = req.params;
      const { userId } = req.payload;
      const requestBody = req.body;
      const { error } = ValidationHelper.createCommentValidate(requestBody);
      if(error){
        console.log("Error validation comment in createComment::", error);
        throw createError.BadRequest(error.details[0].message);
      }

      const test3 = await userModel.getUserById(userId);
      const test1 = await blogModel.getBlogById(blogid);

      const commentid = uuidv4();
      const updateDB = await commentModel.createComment(commentid, requestBody.content, userId, blogid, requestBody.parentId != null ? `${requestBody.parentId}` : "NULL")
      if(updateDB){
        const test2 = await commentModel.getCommentById(commentid);

        const element = SocketContext.connectedSockets.find(socket => socket.userId == test1.userid);
        if(element) {
          element.emit("comment", {
            userId,
            blogid, 
            displayname: test3.displayname,
            title: test1.title,
            time: new Date(),
          });
        }

        res.json(test2);
      } else {
        throw createError.InternalServerError("Update database heart error");
      }
    } catch(err){
      next(err);
    }
  }
  static async editComment(req, res, next) {
    try{
      const { commentid } = req.params;
      const { userId } = req.payload;
      const requestBody = req.body;
      const { error } = ValidationHelper.editCommentValidate(requestBody);
      if(error){
        console.log("Error validation comment in editComment::", error);
        throw createError.BadRequest(error.details[0].message);
      }
      await commentModel.getCommentByUserAndCommentId(userId, commentid);
      const updateDB = await commentModel.updateCommentByUserAndCommentId(requestBody.content, userId, commentid);
      if(updateDB){
        const test2 = await commentModel.getCommentById(commentid);
        res.json(test2);
      } else {
        throw createError.InternalServerError("Update database heart error");
      }
    } catch(err){
      next(err);
    }
  }
  static async deleteComment(req, res, next) {
    try{
      const { commentid, commentUser } = req.params;
      console.log(commentid);
      console.log(commentUser);
      const { userId } = req.payload;
      const test = await commentModel.getCommentByUserAndCommentId(commentUser, commentid);
      if(test.userid != userId){
        const testx = await blogModel.getBlogById(test.blogid);
        if(testx.userid != userId){
          throw createError.BadRequest("Not owner");
        }
      }
      const test1 = await commentModel.deleteCommentById(commentid, commentUser);
      if(test1.affectedRows != 1) {
        throw createError.BadRequest("Error deleting in database");
      }
      res.json(test);
    } catch(err){
      next(err);
    }
  }
  static async getCommentById(req, res, next) {
    try{
      const { commentid } = req.params;
      const test = await commentModel.getCommentById(commentid);
      res.json(test);
    } catch(err){
      next(err);
    }
  }
}

module.exports = CommentController;