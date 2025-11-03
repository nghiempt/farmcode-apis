const Joi = require('joi');

const CreateProductSchema = Joi.object().keys({
  main_image: Joi.string().required(), 
  side_images: Joi.array().items(Joi.string()).required(),
  vietnam_name: Joi.string().required(),
  english_name: Joi.string().required(),
  japan_name: Joi.string().required(),
  vietnam_description: Joi.string().required(),
  english_description: Joi.string().required(),
  japan_description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.string().required(),
});

const UpdateProductSchema = Joi.object().keys({
  main_image: Joi.string().optional(), 
  side_images: Joi.array().items(Joi.string()).optional(),
  vietnam_name: Joi.string().optional(),
  english_name: Joi.string().optional(),
  japan_name: Joi.string().optional(),
  vietnam_description: Joi.string().optional(),
  english_description: Joi.string().optional(),
  japan_description: Joi.string().optional(),
  category: Joi.string().optional(),
  price: Joi.string().optional(),
});

module.exports = {
  CreateProductSchema,
  UpdateProductSchema,
};
