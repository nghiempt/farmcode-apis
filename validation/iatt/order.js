const Joi = require('joi');


const CreateOrderSchema = Joi.object().keys({
  product_id: Joi.string().length(24).required(), 
  image: Joi.string().uri().required(),
  color: Joi.string().max(20).required(),
  size: Joi.string().max(20).required(),
  address: Joi.string().max(250).required(),
  payment_method: Joi.string().valid('bank', 'cash', 'momo').required(),  
  total: Joi.string().required(),
});

const UpdateOrderSchema = Joi.object().keys({
  product_id: Joi.string().length(24), 
  account_id: Joi.string().length(24),
  image: Joi.string().uri(),
  color: Joi.string().max(20),
  size: Joi.string().max(20),
  address: Joi.string().max(250),
  payment_method: Joi.string().valid('bank', 'cash', 'momo'),  
  status: Joi.string().valid('pending', 'waiting',' delivering', 'completed', 'paid', 'paid pending'),
  total: Joi.string(),
  date_completed: Joi.string().allow(''),
});

const AccountOrderSChema = Joi.object().keys({
  _id: Joi.string().length(24),
  name: Joi.string().max(100).required(),
  phone: Joi.string().pattern(/^\d{10,15}$/).required(), 
  address: Joi.string().max(250).required(),
  ward: Joi.string().max(10).required(),
  district: Joi.string().max(10).required(),
  province: Joi.string().max(10).required(),
  districtName: Joi.string().max(100).required(),
  provinceName: Joi.string().max(100).required(),
  wardName: Joi.string().max(100).required()
});

module.exports = {
  CreateOrderSchema,
  UpdateOrderSchema,
  AccountOrderSChema
};
