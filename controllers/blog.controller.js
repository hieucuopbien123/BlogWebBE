const createError = require("http-errors");
const { v4: uuidv4 } = require('uuid');
const ValidationHelper = require("../helpers/validation");
const SocketContext = require("../socketcontext");
const blogModel = require("../models/blog");
const userModel = require("../models/bloguser");
const commentModel = require("../models/comment");
const utilModel = require("../models/util");

class BlogController {
  static async handleImages(req, res, next) {
    try{
      // const { files } = req;
      // res.json({
      //   list: files.map(file => process.env.SERVER_URL + "/tmp/" + file.filename)
      // })
      res.json({
        secure_urls: req.files.map(f => f.path)
      })
    } catch(err){
      next(err);
    }
  }
  static async createBlog(req, res, next) {
    try{
      const requestBody = req.body;
      const { userId } = req.payload;
      const { error } = ValidationHelper.createBlogValidate(req.body);
      if(error){
        console.log("Error validation blog in createBlog::", error);
        throw createError.BadRequest(error.details[0].message);
      }
      const dataToCreate = {
        category: requestBody.category ?? 0,
        title: requestBody.title ?? "Default no title",
        userid: userId,
        content: requestBody.content ?? "Default no content",
        publishedAt: requestBody.published,
        parentId: requestBody.parentId,
        meta: requestBody.meta ?? "Default no meta data",
      }
      const blogid = uuidv4();
      const updateDB = await blogModel.createBlog(blogid, dataToCreate);
      if(updateDB){
        const currentBlog = await blogModel.getBlogById(blogid);
        res.json(currentBlog);
      } else {
        throw createError.InternalServerError("Update database signup error");
      }
    } catch(err){
      next(err);
    }
  }
  static async editBlog(req, res, next) {
    try{
      const requestBody = req.body;
      const { userId } = req.payload;
      const { error } = ValidationHelper.editBlogValidate(req.body);
      if(error){
        console.log("Error validation blog in editblog::", error);
        throw createError.BadRequest(error.details[0].message);
      }
      const oldBlog = await blogModel.getBlogByUserIdAndBlogId(req.params.blogid, userId);
      const dataToUpdate = {
        category: requestBody.category != null ? requestBody.category : oldBlog.category,
        title: requestBody.title != null ? requestBody.title : oldBlog.title,
        content: requestBody.content != null ? requestBody.content : oldBlog.content,
        publishedAt: requestBody.publishedAt == null ? oldBlog.publishedAt : requestBody.publishedAt,
        parentId: requestBody.parentId != null ? requestBody.parentId : oldBlog.parentId,
        meta: requestBody.meta != null ? requestBody.meta : oldBlog.meta,
      }
      const updateDB = await blogModel.updateBlogByUserAndBlogId(dataToUpdate, userId, req.params.blogid);
      if(updateDB){
        const test2 = await blogModel.getBlogByUserIdAndBlogId(req.params.blogid, userId);
        res.json(test2);
      } else {
        throw createError.InternalServerError("Update database signup error");
      }
    } catch(err){
      next(err);
    }
  }
  static async getBlogById(req, res, next) {
    try{
      const { blogid } = req.params;
      const currentBlog = await blogModel.getBlogById(blogid);
      const updateDB = await blogModel.increaseViewById(currentBlog.viewNum + 1, blogid);
      if(updateDB){
        currentBlog.viewNum += 1;
      } else {
        throw createError.InternalServerError("Update database signup error");
      }

      res.json(currentBlog);
    } catch(err){
      next(err);
    }
  }
  static async getListBlog(req, res, next) {
    try{
      const { userid } = req.params;
      await userModel.getUserById(userid);
      const test = await blogModel.getListBlogByUserId(userid);
      res.json(test);
    } catch(err){
      next(err);
    }
  }
  static async viewBlog(req, res, next) {
    try{
      const { blogid } = req.params;
      const currentBlog = await blogModel.getBlogById(blogid);
      const updateDB = await blogModel.increaseViewById(currentBlog.viewNum + 1, blogid);
      if(updateDB){
        res.json({ updatedView: currentBlog.viewNum + 1 })
      } else {
        throw createError.InternalServerError("Update database signup error");
      }
    } catch(err){
      next(err);
    }
  }
  static async deleteBlog(req, res, next) {
    try{
      const { blogid } = req.params;
      const { userId } = req.payload;
      const currentBlog = await blogModel.getBlogByUserIdAndBlogId(blogid, userId);
      // Nên nhét vào transaction để sai 1 bước thì undo tất cả nhưng dự án đơn giản nên k cần
      await utilModel.deleteUtilByBlogId(blogid);
      await commentModel.deleteCommentByBlogId(blogid);
      const test1 = await blogModel.deleteBlogById(blogid, userId);
      if(test1.affectedRows != 1) {
        throw createError.BadRequest("Error deleting in database");
      }
      res.json(currentBlog);
    } catch(err){
      next(err);
    }
  }
  static async heartBlog(req, res, next) {
    try{
      const { blogid } = req.params;
      const { userId } = req.payload;
      const test3 = await userModel.getUserById(userId);
      const requestBody = req.body;
      const test = await blogModel.getBlogById(blogid);
      const test1 = await utilModel.getUtilFromUserAndBlogId(blogid, userId);
      let updateDB = null;
      if(test1.length <= 0) {
        updateDB = await utilModel.createUtilWithHeart(blogid, userId, requestBody.heart == null || requestBody.heart == true ? 1 : 0);
      } else {
        updateDB = await utilModel.updateUtilWithHeart(blogid, userId, requestBody.heart == null || requestBody.heart == true ? 1 : 0);
      }
      if(updateDB){
        const updateDB2 = await blogModel.updateHeartOfBlog(blogid);
        if(updateDB2){
          if(requestBody.heart == true){
            const element = SocketContext.connectedSockets.find(socket => socket.userId == test.userid);
            if(element) {
              element.emit("heart", {
                userId,
                blogid, 
                displayname: test3.displayname,
                title: test.title,
                time: new Date()
              });
            }
          }
          res.send("OK");
        } else {
          throw createError.InternalServerError("Update database heart error");
        }
      } else {
        throw createError.InternalServerError("Update database heart error");
      }
    } catch(err){
      next(err);
    }
  }
  static async hahaBlog(req, res, next) {
    try{
      const { blogid } = req.params;
      const { userId } = req.payload;
      const test3 = await userModel.getUserById(userId);
      const requestBody = req.body;
      const test = await blogModel.getBlogById(blogid);
      const test1 = await utilModel.getUtilFromUserAndBlogId(blogid, userId);
      let updateDB = null;
      if(test1.length <= 0) {
        updateDB = await utilModel.createUtilWithHaha(blogid, userId, requestBody.haha == null || requestBody.haha == true ? 1 : 0);
      } else {
        updateDB = await utilModel.updateUtilWithHaha(blogid, userId, requestBody.haha == null || requestBody.haha == true ? 1 : 0);
      }
      if(updateDB){
        const updateDB2 = await blogModel.updateHahaOfBlog(blogid);
        if(updateDB2){
          if(requestBody.haha == true){
            const element = SocketContext.connectedSockets.find(socket => socket.userId == test.userid);
            if(element) {
              element.emit("heart", {
                userId,
                blogid, 
                displayname: test3.displayname,
                title: test.title,
                time: new Date(),
              });
            }
          }
          res.send("OK");
        }
      } else {
        throw createError.InternalServerError("Update database heart error");
      }
    } catch(err){
      next(err);
    }
  }
  static async getCommentByBlogId(req, res, next) {
    try{
      const { blogid } = req.params;
      const test = await commentModel.getCommentByBlogId(blogid);
      res.json(test);
    } catch(err){
      next(err);
    }
  }
  static async getUserStateForBlog(req, res, next) {
    try{
      const { blogid, userid } = req.params;
      const test = await utilModel.getUtilFromUserAndBlogId(blogid, userid);
      res.json({
        heart: test[0].heart.readUIntBE(0, test[0].heart.length),
        haha: test[0].haha.readUIntBE(0, test[0].haha.length)
      });
    } catch (err){
      next(err);
    }
  }
}

module.exports = BlogController;