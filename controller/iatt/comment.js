const { statusCode, successMessage, failMessage } = require('~/common/message');
const { iattService } = require("~/service");
const { iattValidation } = require('~/validation');


async function getAllCommentsByProductId(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.comment.getAllCommentsByProductId(id)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}


module.exports = {
  getAllCommentsByProductId
};
