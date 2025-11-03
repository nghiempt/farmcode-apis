const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllTimekeepings(request, reply) {
  try {
    const data = await ieltsvietService.timekeeping.getAllTimekeepings();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getTimekeeping(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.timekeeping.getTimekeeping(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createTimekeeping(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.timekeeping.createTimekeeping(id, body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}


module.exports = {
    getAllTimekeepings,
    getTimekeeping,
    createTimekeeping,
};