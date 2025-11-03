const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllAuthors(request, reply) {
  try {
    const data = await ieltsvietService.author.getAllAuthors();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getAuthor(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.author.getAuthor(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
    getAllAuthors,
    getAuthor
};