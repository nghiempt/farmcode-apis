const database = require('~/database/connection');

async function find(query) {
  return database.ecokaBlogCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ecokaBlogCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ecokaBlogCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ecokaBlogCol().updateOne(query, { $set: data });
}

async function findBLogWithPagination(
  query,
  paginate,
  { projection = { password: 0 } } = {}
) {
  const {
    sort = { created_at: -1 },
    skip = 0,
    parsedPageSize = 10,
  } = paginate;
  return await database
    .ecokaBlogCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ecokaBlogCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findBLogWithPagination,
  countDocument,
};
