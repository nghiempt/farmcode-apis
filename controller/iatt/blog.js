const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { iattService } = require('~/service');
const { iattValidation } = require('~/validation');

async function getAllBlogs(request, reply) {
  try {
    const data = await iattService.blog.getAllBlogs();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getBlog(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.blog.getBlog(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createBlog(request, reply) {
  try {
    const blog = request.body;
    await iattValidation.validate(
      blog,
      iattValidation.BlogSchema.CreateBlogSchema,
      reply
    );
    const data = await iattService.blog.createBlog(blog);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateBlog(request, reply) {
  try {
    const { id } = request.params;
    const blog = request.body;
    check = await iattValidation.validate(
      blog,
      iattValidation.BlogSchema.UpdateBlogSchema,
      reply
    );
    if (check === false) {
      return reply
        .status(statusCode.badRequest)
        .send({ message: failMessage.invalidData });
    }
    const data = await iattService.blog.updateBlog(id, blog);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteBlog(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.blog.deleteBlog(id);
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
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
