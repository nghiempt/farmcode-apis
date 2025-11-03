const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllBlogs(request, reply) {
  try {
    const data = await ieltsvietService.blog.getAllBlogs();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getBlog(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.blog.getBlog(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createBlog(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.blog.createBlog(body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteBlog(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.blog.deleteBlog(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateBlog(request, reply) {
    try {
      const { id } = request.params;
      const body = request.body;
      const data = await ieltsvietService.blog.updateBlog(id, body);
      return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
    } catch (err) {
      reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    }
  }

module.exports = {
    getAllBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog,
};