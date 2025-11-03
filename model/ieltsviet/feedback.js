const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietFeedbackCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietFeedbackCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietFeedbackCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietFeedbackCol().updateOne(query, data);
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
    .ieltsvietFeedbackCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietFeedbackCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findStestWithPagination,
  countDocument,
};
