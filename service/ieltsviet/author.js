const { ieltsvietModel } = require('~/model');
const { ObjectId } = require("mongodb");
const crypto = require('crypto');

async function getAllAuthors() {
  const authors = await ieltsvietModel.author.find({});
  return authors
    .filter(author => !author.deleted_at);
}

async function getAuthor(id) {
  const Author = await ieltsvietModel.author.findOne({ _id: new ObjectId(id) });
  return Author;
}



module.exports = {
  getAllAuthors,
  getAuthor,
};
