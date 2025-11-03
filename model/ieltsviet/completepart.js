const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietCompletepartCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietCompletepartCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietCompletepartCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietCompletepartCol().updateOne(query, data );
}

async function findCompletepartWithPagination(
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
    .ieltsvietCompletepartCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietCompletepartCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findCompletepartWithPagination,
  countDocument,
};
