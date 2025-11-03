const { iattModel } = require('~/model');
const payment = require('~/service/iatt/payment');
const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');

async function getAllCommentsByProductId(id) {
  const comments = await iattModel.comment.find({ product_id: new ObjectId(id) });
  return comments
    .filter(order => !order.deleted_at);
}

module.exports = {
  getAllCommentsByProductId
};
