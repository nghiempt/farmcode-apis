const { ecokaModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllProducts() {
  const products = await ecokaModel.product.find({});
  return products.filter((product) => !product.deleted_at);
}

async function getProductById(id) {
  return ecokaModel.product.findOne({ _id: new ObjectId(id) });
}

async function updateProduct(id, data) {
  return ecokaModel.product.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function createProduct(data) {
  const insert_product = {
    main_image: data.main_image,
    side_images: data.side_images,
    vietnam_name: data.vietnam_name,
    english_name: data.english_name,
    japan_name: data.japan_name,
    vietnam_description: data.vietnam_description,
    english_description: data.english_description,
    japan_description: data.japan_description,
    category: data.category,
    price: data.price,
    show_status: data.show_status,
  };
  return await ecokaModel.product.insertOne(insert_product);
}

async function deleteProduct(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ecokaModel.product.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
