const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { ieltsvietService } = require('~/service');

async function getAllVideos(request, reply) {
  try {
    const data = await ieltsvietService.video.getAllVideos();
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

async function createVideo(request, reply) {
  try {
    body = request.body;
    const data = await ieltsvietService.video.createVideo(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateVideo(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.video.updateVideo(id, body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteVideo(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.video.deleteVideo(id);
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
  getAllVideos,
  createVideo,
  deleteVideo,
  updateVideo,
};
