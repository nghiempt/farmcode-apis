const { ieltsvietModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllFiles() {
  const files = await ieltsvietModel.file.find({});
  return files
    .filter(file => !file.deleted_at);
}

async function getFile(id) {
  return ieltsvietModel.file.findOne({ _id: new ObjectId(id) });
}

async function updateFile(id, data) {
  return ieltsvietModel.file.updateOne({ _id: new ObjectId(id) }, data);
}

async function createFile(data) {
  const data_insert = {
    ...data,
  };
  return await ieltsvietModel.file.insertOne(data_insert);
}

async function deleteFile(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.file.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile
};
