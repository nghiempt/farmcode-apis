const { ieltsvietModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllVideos() {
  const videos = await ieltsvietModel.video.find({});
  return videos.filter((video) => !video.deleted_at);
}

async function createVideo(data) {
  return await ieltsvietModel.video.insertOne(data);
}

async function updateVideo(id, data) {
  const dataUpdate = {
    ...data,
    updated_at: new Date(),
  };
  return ieltsvietModel.video.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function deleteVideo(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.video.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
};
