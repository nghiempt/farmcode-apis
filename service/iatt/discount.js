const { ObjectId } = require('mongodb');
const { iattModel } = require('~/model');

async function checkDiscount(code) {
  const check = await iattModel.discount.findOne({ code: code });
  if (check != null) {
    return check;
  }
  return 'Discount code not found';
}

async function getAllDiscount() {
  const discount = await iattModel.discount.find({});
  return discount.filter((item) => !item.deleted_at);
}

async function getDiscount(id) {
  return await iattModel.discount.findOne({ _id: new ObjectId(id) });
}

async function createDiscount(data) {
  const insertData = {
    ...data,
  };
  return await iattModel.discount.insertOne(insertData);
}

async function updateDiscount(id, data) {
  return await iattModel.discount.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function deleteDiscount(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return iattModel.discount.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  checkDiscount,
  getAllDiscount,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
