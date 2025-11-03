const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietTestpartCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietTestpartCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietTestpartCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietTestpartCol().updateOne(query, data );
}

async function findTestpartWithPagination(
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
    .ieltsvietTestpartCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietTestpartCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findTestpartWithPagination,
  countDocument,
};
