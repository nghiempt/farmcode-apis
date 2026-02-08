const Joi = require('joi');

const ProductOptionSchema = Joi.object().keys({
  size: Joi.string().required(),
  price: Joi.string().required(),
});

const CreateProductSchema = Joi.object().keys({
  name: Joi.string().max(250).required(),
  description: Joi.string().required(),
  introduction: Joi.string().optional(),
  product_option: Joi.array()
    .items(ProductOptionSchema)
    .min(1)
    .required(),
  category: Joi.string()
    .valid('Frame', 'Album', 'Plastic', 'Plastic-Frame')
    .required(),
  color: Joi.array()
    .items(
      Joi.string().valid('black', 'gold', 'white', 'wood', 'silver')
    )
    .required(),
  discount: Joi.number().required(),
  rating: Joi.number().required(),
  thumbnail: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).required(),
  video: Joi.string().uri().allow('').optional(),
  active: Joi.boolean().required(),
});

const UpdateProductSchema = Joi.object().keys({
  name: Joi.string().max(250).optional(),
  description: Joi.string().optional(),
  introduction: Joi.string().optional(),
  product_option: Joi.array()
    .items(ProductOptionSchema)
    .min(1)
    .optional(),
  category: Joi.string()
    .valid('Frame', 'Album', 'Plastic', 'Plastic-Frame')
    .optional(),
  color: Joi.array()
    .items(
      Joi.string().valid('black', 'gold', 'white', 'wood', 'silver')
    )
    .optional(),
  discount: Joi.number().optional(),
  rating: Joi.number().optional(),
  sold: Joi.number().optional(),
  thumbnail: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  video: Joi.string().uri().allow('').optional(),
  active: Joi.boolean().optional(),
});

module.exports = {
  CreateProductSchema,
  UpdateProductSchema,
};
