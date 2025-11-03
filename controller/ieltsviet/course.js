const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { ieltsvietService } = require('~/service');

async function getAllCourses(request, reply) {
  try {
    const data = await ieltsvietService.course.getAllCourses();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
    console.log(err);
  }
}

async function createCourse(request, reply) {
  try {
    body = request.body;
    const data = await ieltsvietService.course.createCourse(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateCourse(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.course.updateCourse(id, body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteCourse(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.course.deleteCourse(id);
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
  getAllCourses,
  createCourse,
  deleteCourse,
  updateCourse,
};
