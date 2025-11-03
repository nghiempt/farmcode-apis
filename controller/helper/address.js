const { statusCode, successMessage, failMessage } = require('~/common/message');
const { helperService } = require("~/service");

async function getAllAddresses(request, reply) {
  try {
    const res = await helperService.address.getAllAddresses()
    return reply.status(statusCode.success).send(res);
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  getAllAddresses
};
