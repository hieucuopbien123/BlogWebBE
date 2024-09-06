const ValidationHelper = require("../helpers/validation");
const createError = require("http-errors");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const { emailService, jwtService, gmailLogin } = require("../services");
const path = require("path");
const userModel = require("../models/bloguser");

class AuthController {
  static async signup(req, res, next) {
    try{
      const { username, password, email, displayname } = req.body;
      const { error } = ValidationHelper.userValidate(req.body);
      if(error){
        console.log("Error validation user in signup::", error);
        throw createError.BadRequest(error.details[0].message);
      }
      await userModel.getUserByEmailOrUsername(username, email);
      const idUser = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      try{
        const data = { to: email, subject: "Verify account in BlogWeb!!" };
        const a = await emailService.sendEjsMail({
          template: "verifypassword",
          templateVars: { name: username, email, url: `${process.env.SERVER_URL}/api/v1/auth/verifySignup/${idUser}` },
          ...data,
        });
      } catch(err){
        throw createError.InternalServerError(`Error sending mail::`, err);
      }

      const updateDB = await userModel.createNewUser(idUser, username, hashedPassword, email, displayname);
      if(updateDB){
          res.send("Send mail successfully!");
      } else {
        throw createError.InternalServerError("Update database signup error");
      }
    } catch(err){
      next(err);
    }
  }
  static async verifySignup(req, res, next){
    try{
      const { slug } = req.params;
      const currentUser = await userModel.getUserById(slug);
      if(currentUser.emailverified.readUIntBE(0, currentUser.emailverified.length) == 0){
        const test2 = await userModel.verifyMailById(slug);
        if(test2) {
          res.sendFile("templates/verifysuccess.html", {root: path.join(__dirname, "..")});
        } else {
          throw createError.InternalServerError("Update database verifySignup error");
        }
      } else if(currentUser.emailverified.readUIntBE(0, currentUser.emailverified.length) == 1){
        res.sendFile("templates/alreadyverifysuccess.html", {root: path.join(__dirname, "..")});
      }
    } catch(err){
      next(err);
    }
  }
  static async signin(req, res, next) {
    try{
      const { username, password } = req.body;
      const { error } = ValidationHelper.loginValidate(req.body);
      if(error){
        console.log("Error validation user in signin::", error);
        throw createError.BadRequest(error.details[0].message);
      }
      const currentUser = await userModel.getUserByUsername(username);
      const isRightPassword = await bcrypt.compare(password, currentUser.password);
      if(!isRightPassword){
        throw createError.Unauthorized("Password is wrong!");
      }
      if(currentUser.emailverified.readUIntBE(0, currentUser.emailverified.length) == 0){
        throw createError.Unauthorized("Email is not verified yet!");
      }
      const accessToken = await jwtService.signAccessToken(currentUser.id);
      res.json({
        accessToken,
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        email: currentUser.email,
        dateofbirth: currentUser.dateofbirth,
        gender: currentUser.gender == null ? 0 : currentUser.gender.readUIntBE(0, currentUser.gender.length),
        displayname: currentUser.displayname,
        bio: currentUser.bio
      })
    } catch(err){
      next(err);
    }
  }
  static async signinwithgmail(req, res, next) {
    try{
		  const token = req.headers.authorization.split(' ')[1];
			const decodeValue = await gmailLogin.auth().verifyIdToken(token);
      if (decodeValue) {
        const emailUserSent = decodeValue.email;
        const currentUser = await userModel.getUserByEmail(emailUserSent);
        const accessToken = await jwtService.signAccessToken(currentUser.id);
				res.json({
          accessToken,
          id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          email: currentUser.email,
          dateofbirth: currentUser.dateofbirth,
          gender: currentUser.gender == null ? 0 : currentUser.gender.readUIntBE(0, currentUser.gender.length),
          displayname: currentUser.displayname,
          bio: currentUser.bio
        });
			}
    } catch(err){
      next(err);
    }
  }
}

module.exports = AuthController;