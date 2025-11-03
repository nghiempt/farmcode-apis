const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietBtestCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietBtestCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietBtestCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietBtestCol().updateOne(query, data);
}

async function findBtestWithPagination(
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
    .ieltsvietBtestCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietBtestCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findBtestWithPagination,
  countDocument,
};
