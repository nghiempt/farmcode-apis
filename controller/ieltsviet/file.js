const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllFiles(request, reply) {
  try {
    const data = await ieltsvietService.file.getAllFiles();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getFile(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.file.getFile(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createFile(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.file.createFile(body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteFile(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.file.deleteFile(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateFile(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.file.updateFile(id, body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
    } catch (err) {
      reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    }
  }

module.exports = {
    getAllFiles,
    getFile,
    createFile,
    deleteFile,
    updateFile,
};