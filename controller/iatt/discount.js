const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { iattService } = require('~/service');

async function checkDiscount(request, reply) {
  try {
    const { code } = request.body;
    const data = await iattService.discount.checkDiscount(code);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllDiscount(request, reply) {
  try {
    const data = await iattService.discount.getAllDiscount();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getDiscount(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.discount.getDiscount(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createDiscount(request, reply) {
  try {
    const body = request.body;

    const data = await iattService.discount.createDiscount(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateDiscount(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await iattService.discount.updateDiscount(id, body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteDiscount(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.discount.deleteDiscount(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

module.exports = {
  checkDiscount,
  getAllDiscount,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
