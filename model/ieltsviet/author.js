const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietAuthorCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietAuthorCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietAuthorCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietAuthorCol().updateOne(query, { $set: data });
}

async function findAuthorWithPagination(
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
    .ieltsvietAuthorCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietAuthorCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findAuthorWithPagination,
  countDocument,
};
