const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietUserCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietUserCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietUserCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietUserCol().updateOne(query, { $set: data });
}

async function findUserWithPagination(
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
    .ieltsvietUserCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietUserCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findUserWithPagination,
  countDocument,
};
