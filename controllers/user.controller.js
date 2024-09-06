const createError = require("http-errors");
const ValidationHelper = require("../helpers/validation");
const bcrypt = require("bcrypt");
const userModel = require("../models/bloguser");

class UserController {
  static async getUserById(req, res, next){
    try{
      const { id } = req.params;
      const currentUser = await userModel.getUserById(id);
      res.json({
        // Khi dùng hàm này, các trường nào là undefined nó tự bỏ qua không gửi
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        email: currentUser.email,
        dateofbirth: currentUser.dateofbirth,
        gender: currentUser.gender == null ? 0 : currentUser.gender.readUIntBE(0, currentUser.gender.length),
        displayname: currentUser.displayname,
        bio: currentUser.bio,
      });
    } catch(err){
      next(err);
    }
  }
  static async editUserById(req, res, next){
    try{
      const { userId } = req.payload;
      const requestBody = req.body;
      const { file } = req;
      if(!!requestBody.email && !!requestBody.username){
        throw createError.BadRequest("Username and email cannot be edited");
      }
      const { error } = ValidationHelper.editUserValidate(requestBody);
      if(error){
        console.log("Error validation user in editUser::", error);
        throw createError.InternalServerError(error.details[0].message);
      }
      const oldUser = await userModel.getUserById(userId);
      oldUser.gender = oldUser.gender.readUIntBE(0, oldUser.gender.length); // Database luôn có giá trị 

      const dataToUpdate = {
        // avatar: file != null ? process.env.SERVER_URL + "/tmp/" + file.filename : oldUser.avatar,
        avatar: !!file?.path ? file.path : oldUser.avatar,
        dateofbirth: requestBody.dateofbirth != null ? new Date(requestBody.dateofbirth) : new Date(oldUser.dateofbirth),
        gender: requestBody.gender != null ? requestBody.gender : oldUser.gender,
        displayname: requestBody.displayname != null ? requestBody.displayname : oldUser.displayname,
        bio: requestBody.bio != null ? requestBody.bio : oldUser.bio,
      }
      const test2 = await userModel.updateUserById(dataToUpdate, userId);
      if(test2) {
        const test3 = await userModel.getUserById(userId);
        res.json({
          ...test3,
          gender: test3.gender.readUIntBE(0, test3.gender.length),
          emailverified: test3.emailverified.readUIntBE(0, test3.emailverified.length),
        });
      } else {
        throw createError.InternalServerError("Update database verifySignup error");
      }
    } catch(err){
      next(err);
    }
  }
  static async changePassword(req, res, next){
    try{
      const requestBody = req.body;
      const { error } = ValidationHelper.changePasswordValidate(req.body);
      if(error){
        console.log("Error validation user in changePassword::", error);
        throw createError.BadRequest(error.details[0].message);
      }
      const currentUser = await userModel.getUserById(requestBody.userId);
      const isRightPassword = await bcrypt.compare(requestBody.oldPassword, currentUser.password);
      if(!isRightPassword) {
        throw createError.BadRequest("Your password is wrong!");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(requestBody.newPassword, salt);
      const test2 = await userModel.changePasswordById(hashedPassword, requestBody.userId);
      if(test2) {
        res.send("OK");
      } else {
        throw createError.InternalServerError("Update database verifySignup error");
      }
    } catch(err){
      next(err);
    }
  }
}

module.exports = UserController;