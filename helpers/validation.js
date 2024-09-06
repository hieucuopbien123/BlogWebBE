const Joi = require("joi");

class ValidationHelper {
  static userValidate(data){
    const userSchema = Joi.object({
      email: Joi.string().email().lowercase().required(),
      username: Joi.string().min(5).max(32).required(),
      displayname: Joi.string().min(1).max(32).required(),
      password: Joi.string().min(5).max(32).required(),
    });
    return userSchema.validate(data);
  }
  static loginValidate(data){
    const loginSchema = Joi.object({
      username: Joi.string().max(32).required(),
      password: Joi.string().min(4).max(32).required(),
    });
    return loginSchema.validate(data);
  }
  static editUserValidate(data){
    const editUserSchema = Joi.object({
      dateofbirth: [Joi.string().optional(), Joi.allow(null)],
      gender: [Joi.number().min(0).max(1).optional(), Joi.allow(null)],
      displayname: [Joi.string().min(1).max(32).optional(), Joi.allow(null)],
      bio: [Joi.string().max(600).optional(), Joi.allow(null)],
    });
    return editUserSchema.validate(data);
  }
  static createBlogValidate(data){
    const createBlogSchema = Joi.object({
      category: [Joi.number().min(0).max(4).optional(), Joi.allow(null)],
      title: [Joi.string().optional(), Joi.allow(null)],
      content: [Joi.string().optional(), Joi.allow(null)],
      published: [Joi.bool().optional(), Joi.allow(null)],
      parentId: [Joi.string().length(36).optional(), Joi.allow(null)],
      meta: [Joi.string().optional(), Joi.allow(null)]
    });
    return createBlogSchema.validate(data);
  }
  static editBlogValidate(data){
    const editBlogSchema = Joi.object({
      category: [Joi.number().min(0).max(4).optional(), Joi.allow(null)],
      title: [Joi.string().optional(), Joi.allow(null)],
      content: [Joi.string().optional(), Joi.allow(null)],
      publishedAt: [Joi.bool().optional(), Joi.allow(null)],
      parentId: [Joi.string().length(36).optional(), Joi.allow(null)],
      meta: [Joi.string().optional(), Joi.allow(null)]
    });
    return editBlogSchema.validate(data);
  }
  static createCommentValidate(data){
    const createCommentSchema = Joi.object({
      content: Joi.string().min(1).required(),
      parentId: [Joi.string().length(36).optional(), Joi.allow(null)]
    });
    return createCommentSchema.validate(data);
  }
  static editCommentValidate(data){
    const createCommentSchema = Joi.object({
      content: Joi.string().min(1).required()
    });
    return createCommentSchema.validate(data);
  }
  static changePasswordValidate(data){
    const changePasswordSchema = Joi.object({
      userId: Joi.string().length(36).required(),
      oldPassword: Joi.string().min(4).max(32).required(),
      newPassword: Joi.string().min(4).max(32).required(),
    });
    return changePasswordSchema.validate(data);
  }
  static searchValidate(data){
    const searchSchema = Joi.object({
      searchtext: [Joi.string().optional(), Joi.allow(null)],
      orderby: [Joi.string().optional(), Joi.allow(null)],
      orderdirection: [Joi.string().valid('asc', 'desc').optional(), Joi.allow(null)],
      userid: [Joi.string().length(36).optional(), Joi.allow(null)],
      page: [Joi.number().min(1).optional(), Joi.allow(null)],
      perpage: [Joi.number().min(1).optional(), Joi.allow(null)],
    });
    return searchSchema.validate(data, {
      allowUnknown: true,
    });
  }
}

module.exports = ValidationHelper;
