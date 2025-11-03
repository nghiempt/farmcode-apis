const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { ieltsvietService } = require('~/service');

async function getAllUsers(request, reply) {
  try {
    const data = await ieltsvietService.user.getAllUsers();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getUser(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.user.getUser(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function loginUser(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.user.loginUser(body);
    if (data.message != 'Login successfully') {
      return reply
        .status(statusCode.badRequest)
        .send({ message: data.message });
    }
    return reply
      .status(statusCode.success)
      .send({ data: data.user, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createUser(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.user.createUser(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteUser(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.user.deleteUser(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateUser(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.user.updateUser(id, body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function changePassword(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.user.changePassword(id, body);
    if (data.message) {
      return reply
        .status(statusCode.badRequest)
        .send({ message: data.message });
    }
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
  getAllUsers,
  getUser,
  loginUser,
  createUser,
  deleteUser,
  updateUser,
  changePassword,
};
