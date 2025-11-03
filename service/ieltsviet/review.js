const { ieltsvietModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllReviews() {
  const reviews = await ieltsvietModel.review.find({});
  return reviews
    .filter(review => !review.deleted_at);
}

async function getReview(id) {
  return ieltsvietModel.review.findOne({ _id: new ObjectId(id) });
}

async function updateReview(id, data) {
  return ieltsvietModel.review.updateOne({ _id: new ObjectId(id) }, data);
}

async function createReview(data) {
  return await ieltsvietModel.review.insertOne(data);
}

async function deleteReview(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.review.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
};
