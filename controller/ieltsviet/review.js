const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllReviews(request, reply) {
  try {
    const data = await ieltsvietService.review.getAllReviews();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getReview(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.review.getReview(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createReview(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.review.createReview(body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteReview(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.review.deleteReview(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateReview(request, reply) {
    try {
      const { id } = request.params;
      const body = request.body;
      const data = await ieltsvietService.review.updateReview(id, body);
      return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
    } catch (err) {
      reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    }
  }

module.exports = {
    getAllReviews,
    getReview,
    createReview,
    deleteReview,
    updateReview,
};