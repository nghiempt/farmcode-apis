
const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ecokaService } = require("~/service");
const { ecokaValidation } = require('~/validation');
async function getAllBlogs(request, reply) {
  try {
    const data = await ecokaService.blog.getAllBlogs()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getBlogById(request, reply) {
  try {
    const { id } = request.params
    const data = await ecokaService.blog.getBlogById(id)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createBlog(request, reply) {
  try {
    const body = request.body
    // ecokaValidation.validate(body, ecokaValidation.blogSchema.CreateBlogSchema, reply);
    const data = await ecokaService.blog.createBlog(body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateBlog(request, reply) {
  try {
    const { id } = request.params
    const body  = request.body
    // ecokaValidation.validate(body, ecokaValidation.blogSchema.UpdateBlogSchema, reply);
    const data = await ecokaService.blog.updateBlog(id, body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteBlog(request, reply) {
  try {
    const { id } = request.params
    const data = await ecokaService.blog.deleteBlog(id)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
