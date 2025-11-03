const { statusCode, successMessage, failMessage } = require('~/common/message');
const { iattService } = require("~/service");


async function checkDiscount(request, reply) {
  try {
    const { code } = request.body;
    const data = await iattService.discount.checkDiscount(code)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}



module.exports = {
  checkDiscount
};
