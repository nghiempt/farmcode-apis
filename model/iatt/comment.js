const database = require('~/database/connection');

async function find(query) {
  return database.iattCommentCol().find(query).toArray();
}
async function insertOne(data) {
  return database.iattCommentCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.iattCommentCol().findOne(query);
}

async function updateOne(query, data) {
  return database.iattCommentCol().updateOne(query, { $set: data });
}

async function countDocument(query) {
  return await database.iattCommentCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  countDocument,
};
