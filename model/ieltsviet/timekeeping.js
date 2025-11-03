const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietTimekeepingCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietTimekeepingCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietTimekeepingCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietTimekeepingCol().updateOne(query, { $set: data });
}

async function findTimekeepingWithPagination(
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
    .ieltsvietTimekeepingCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietTimekeepingCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findTimekeepingWithPagination,
  countDocument,
};
