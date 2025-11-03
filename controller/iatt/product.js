const { statusCode, successMessage, failMessage } = require('~/common/message');
const { iattService } = require("~/service");
const { iattValidation } = require('~/validation');

async function getAllProducts(request, reply) {
  try {
    const data = await iattService.product.getAllProducts();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}
async function getProduct(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.product.getProduct(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createProduct(request, reply) {
  try {
    const product = request.body;
    const check = await iattValidation.validate(product, iattValidation.ProductSchema.CreateProductSchema, reply);
    const data = await iattService.product.createProduct(product)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateProduct(request, reply) {
  try {
    const { id } = request.params;
    const product = request.body;
    const check = await iattValidation.validate(product, iattValidation.ProductSchema.UpdateProductSchema, reply);
    if (check === false) {
      return reply.status(statusCode.badRequest).send({ message: failMessage.invalidData });
    };
    const data = await iattService.product.updateProduct(id, product)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteProduct(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.product.deleteProduct(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
