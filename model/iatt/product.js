const database = require('~/database/connection');

async function find(query) {
  return database.iattProductCol().find(query).toArray();
}
async function insertOne(data) {
  return database.iattProductCol().insertOne({
    ...data,
    sold: 0,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.iattProductCol().findOne(query);
}

async function updateOne(query, data) {
  return database.iattProductCol().updateOne(query, { $set: data });
}

async function findproductWithPagination(
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
    .iattProductCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.iattProductCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findproductWithPagination,
  countDocument,
};
