const Joi = require('joi');

const CreateBlogSchema = Joi.object().keys({
  title: Joi.string().max(255).required(),
  content: Joi.string().required(),
  tag: Joi.string()
    .valid(
      'frame',
      'printing',
      'album',
      'photo-care',
      'digital-frame'
    )
    .required(),
  excerpt: Joi.string().optional(),
  author: Joi.string().max(100).required(),
  thumbnail: Joi.string().uri().required(),
});

const UpdateBlogSchema = Joi.object().keys({
  title: Joi.string().max(255).optional(),
  content: Joi.string().optional(),
  tag: Joi.string()
    .valid(
      'frame',
      'printing',
      'album',
      'photo-care',
      'digital-frame'
    )
    .optional(),
  excerpt: Joi.string().optional(),
  author: Joi.string().max(100).optional(),
  thumbnail: Joi.string().uri().optional(),
});

module.exports = {
  CreateBlogSchema,
  UpdateBlogSchema,
};
