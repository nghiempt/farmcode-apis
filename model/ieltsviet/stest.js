const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietStestCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietStestCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietStestCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietStestCol().updateOne(query, data );
}

async function findStestWithPagination(
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
    .ieltsvietStestCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietStestCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findStestWithPagination,
  countDocument,
};
