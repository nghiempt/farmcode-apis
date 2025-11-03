const { iattModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllProducts() {
  const products = await iattModel.product.find({});
  return products.filter((product) => !product.deleted_at);
}

async function getProduct(id) {
  return iattModel.product.findOne({ _id: new ObjectId(id) });
}

async function updateProduct(id, data) {
  return iattModel.product.updateOne({ _id: new ObjectId(id) }, data);
}

async function createProduct(data) {
  return await iattModel.product.insertOne(data);
}

async function deleteProduct(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return iattModel.product.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
