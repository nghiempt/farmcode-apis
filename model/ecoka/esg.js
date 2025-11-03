const database = require('~/database/connection');

async function find(query) {
  return database.ecokaEsgCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ecokaEsgCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ecokaEsgCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ecokaEsgCol().updateOne(query, { $set: data });
}

async function findEsgWithPagination(
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
    .ecokaEsgCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ecokaEsgCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findEsgWithPagination,
  countDocument,
};
