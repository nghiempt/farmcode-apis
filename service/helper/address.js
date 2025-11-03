const { helperModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllAddresses() {
  return helperModel.address.find({});
}

async function getAddressById(id) {
  return helperModel.address.findOne({ _id: new ObjectId(id) });
}

async function updateAddress(id, data) {
  return helperModel.address.updateOne({ _id: new ObjectId(id) }, data);
}

async function createAddress(data) {
  return await helperModel.address.insertOne(data);
}

async function deleteAddress(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return helperModel.address.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllAddresses,
  getAddressById,
  updateAddress,
  createAddress,
  deleteAddress,
};
