const database = require('~/database/connection');

async function find(query) {
  return database.helperAddressCol().find(query).toArray();
}
async function insertOne(data) {
  return database.helperAddressCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.helperAddressCol().findOne(query);
}

async function updateOne(query, data) {
  return database.helperAddressCol().updateOne(query, { $set: data });
}

async function findAddressWithPagination(
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
    .helperAddressCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.helperAddressCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findAddressWithPagination,
  countDocument,
};
