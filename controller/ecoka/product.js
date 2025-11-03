
const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ecokaService } = require("~/service");
const { ecokaValidation } = require('~/validation');
async function getAllProducts(request, reply) {
  try {
    const data = await ecokaService.product.getAllProducts()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getProductById(request, reply) {
  try {
    const { id } = request.params
    const data = await ecokaService.product.getProductById(id)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createProduct(request, reply) {
  try {
    const body = request.body
    ecokaValidation.validate(body, ecokaValidation.ProductSchema.CreateProductSchema, reply);
    const data = await ecokaService.product.createProduct(body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateProduct(request, reply) {
  try {
    const { id } = request.params
    const body  = request.body
    ecokaValidation.validate(body, ecokaValidation.ProductSchema.UpdateProductSchema, reply);
    const data = await ecokaService.product.updateProduct(id, body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteProduct(request, reply) {
  try {
    const { id } = request.params
    const data = await ecokaService.product.deleteProduct(id)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
