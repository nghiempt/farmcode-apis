const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietVideosCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietVideosCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietVideosCol().findOne(query);
}

async function updateOne(query, data) {
  return database
    .ieltsvietVideosCol()
    .updateOne(query, { $set: data });
}

async function findSliderWithPagination(
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
    .ieltsvietVideosCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietVideosCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findSliderWithPagination,
  countDocument,
};
