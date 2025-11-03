const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllSliders(request, reply) {
  try {
    const data = await ieltsvietService.slider.getAllSliders()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    console.log(err)
  }
}

async function createSlider(request, reply) {
    try {
      body = request.body;
      const data = await ieltsvietService.slider.createSlider(body);
      return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
    } catch (err) {
      reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    }
}

async function updateSlider(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.slider.updateSlider(id, body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteSlider(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.slider.deleteSlider(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
    getAllSliders,
    createSlider,
    deleteSlider,
    updateSlider
};