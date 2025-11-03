const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietReviewCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietReviewCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietReviewCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietReviewCol().updateOne(query, { $set: data });
}

async function findReviewWithPagination(
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
    .ieltsvietReviewCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietReviewCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findReviewWithPagination,
  countDocument,
};
