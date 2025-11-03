const { statusCode, successMessage, failMessage } = require('~/common/message');
const { iattService } = require("~/service");

async function momo(request, reply) {
  try {
    const body = request.body;
    const result = await iattService.payment.momo(body);
    return reply.status(statusCode.success).send({ data: result, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function callback(request, reply) {
  try {
    // update order status
    await iattService.order.updateOrder(request.body.orderId, { status: 'paid' });
    return reply.status(statusCode.success).send({ message: "Update Successfully" });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  momo,
  callback
};
